const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get All Categories Route
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate('parentCategory');
    res.status(200).json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add Category Route
router.post('/', async (req, res) => {
  const { name, parentCategory } = req.body;

  try {
    if (parentCategory) {
      // This is a subcategory being added as a new category document (old logic)
      // This part might need to be refactored if subcategories are only strings within parent
      let category = await Category.findOne({ name, parentCategory });
      if (category) {
        return res.status(400).json({ message: 'Subcategory already exists under this parent' });
      }
      const newCategory = new Category({ name, parentCategory });
      await newCategory.save();
      res.status(201).json({ message: 'Subcategory added successfully', category: newCategory });
    } else {
      // This is a main category
      let category = await Category.findOne({ name });
      if (category) {
        return res.status(400).json({ message: 'Category already exists' });
      }
      const newCategory = new Category({ name });
      await newCategory.save();
      res.status(201).json({ message: 'Category added successfully', category: newCategory });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add subcategory (string) to an existing category
router.put('/:id/subcategory', async (req, res) => {
  const { id } = req.params;
  const { subCategoryName } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.subcategories.includes(subCategoryName)) {
      return res.status(400).json({ message: 'Subcategory already exists in this category' });
    }

    category.subcategories.push(subCategoryName);
    await category.save();
    res.status(200).json({ message: 'Subcategory added successfully', category });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
