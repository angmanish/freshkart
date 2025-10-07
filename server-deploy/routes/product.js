const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Add Product Route
router.post('/', upload.single('image'), async (req, res) => {
  const { name, originalPrice, discountPrice, categoryId, likes, rating, description, quantity, weight, subCategory } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    // Validate subCategory against category
    if (subCategory) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (!category.subcategories.includes(subCategory)) {
        return res.status(400).json({ message: `Subcategory '${subCategory}' not found in category '${category.name}'` });
      }
    }
    const newProduct = new Product({
      name,
      originalPrice,
      discountPrice,
      categoryId,
      imageUrl,
      likes,
      rating,
      description,
      quantity,
      weight,
      subCategory,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get All Products Route
router.get('/', async (req, res) => {
  const { page, limit, all, search } = req.query;
  let query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' }; // Case-insensitive search by product name
  }

  try {
    if (all === 'true') {
      const products = await Product.find(query).populate('categoryId');
      return res.status(200).json({
        products,
        currentPage: 1,
        totalPages: 1,
        totalProducts: products.length,
      });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10; // Default to 10 products per page
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query); // Count with search query
    const products = await Product.find(query) // Find with search query
      .populate('categoryId')
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      products,
      currentPage: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete Product Route
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Optionally, delete the image file from the server
    if (product.imageUrl) {
      const imagePath = path.join(__dirname, '../', product.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Product Route
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, originalPrice, discountPrice, categoryId, likes, rating, description, quantity, weight, subCategory } = req.body;
  let imageUrl = req.body.imageUrl; // Keep existing image if not new one uploaded

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate subCategory against category
    if (subCategory) {
      const category = await Category.findById(categoryId || product.categoryId); // Use new categoryId if provided, else existing
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (!category.subcategories.includes(subCategory)) {
        return res.status(400).json({ message: `Subcategory '${subCategory}' not found in category '${category.name}'` });
      }
    }
    // If a new image is uploaded, update imageUrl and delete old image
    if (req.file) {
      if (product.imageUrl) {
        const oldImagePath = path.join(__dirname, '../', product.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image file:', err);
        });
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, {
      name,
      originalPrice,
      discountPrice,
      categoryId,
      imageUrl,
      likes,
      rating,
      description,
      quantity,
      weight,
      subCategory,
    }, { new: true }); // {new: true} returns the updated document

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
