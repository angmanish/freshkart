const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Helper function to get the start date for a given number of months ago
const getStartDate = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
};

// ----------------- Sales Over Time -----------------
router.get('/sales-over-time', async (req, res) => {
  const months = parseInt(req.query.months) || 12;
  const startDate = getStartDate(months);

  try {
    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSales: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format data for the chart
    const formattedData = salesData.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      sales: item.totalSales,
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- Orders by Category -----------------
router.get('/orders-by-category', async (req, res) => {
  const months = parseInt(req.query.months) || 12;
  const startDate = getStartDate(months);

  try {
    const orders = await Order.find({ createdAt: { $gte: startDate } }).populate({ path: 'items.productId', populate: { path: 'categoryId' } });

    const categoryCounts = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId && item.productId.categoryId) {
          const categoryName = item.productId.categoryId.name; // Assuming you have category name in product
          if (categoryName) {
            categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
          }
        }
      });
    });

    const formattedData = Object.keys(categoryCounts).map(key => ({
      category: key,
      orders: categoryCounts[key],
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- Revenue Sources (Example) -----------------
// This is a placeholder as "revenue source" is not defined in the Order model.
// We will simulate it based on payment method.
router.get('/revenue-sources', async (req, res) => {
    const months = parseInt(req.query.months) || 12;
    const startDate = getStartDate(months);

    try {
        const revenueData = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$paymentMethod',
                    value: { $sum: '$totalAmount' },
                },
            },
        ]);

        const formattedData = revenueData.map(item => ({
            source: item._id,
            value: item.value,
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ----------------- User Growth -----------------
router.get('/user-growth', async (req, res) => {
  const months = parseInt(req.query.months) || 12;
  const startDate = getStartDate(months);

  try {
    const userData = await User.aggregate([
      { $match: { registrationDate: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$registrationDate' },
            month: { $month: '$registrationDate' },
          },
          users: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const formattedData = userData.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      users: item.users,
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// ----------------- Most Buying Products -----------------
router.get('/most-buying-products', async (req, res) => {
  const months = parseInt(req.query.months) || 12;
  const startDate = getStartDate(months);

  try {
    const mostBuyingProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalQuantitySold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products', // The collection name for products
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          _id: 0,
          productId: '$productDetails._id',
          name: '$productDetails.name',
          imageUrl: '$productDetails.imageUrl',
          totalQuantitySold: 1,
        },
      },
    ]);

    // Calculate total quantity of all products sold within the period
    const totalProductsSoldResult = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      { $group: { _id: null, overallTotalQuantitySold: { $sum: '$items.quantity' } } },
    ]);

    const overallTotalQuantitySold = totalProductsSoldResult.length > 0 ? totalProductsSoldResult[0].overallTotalQuantitySold : 0;

    const formattedProducts = mostBuyingProducts.map((product, index) => ({
      rank: index + 1,
      name: product.name,
      imageUrl: product.imageUrl,
      buyingPercentage: overallTotalQuantitySold > 0 ? ((product.totalQuantitySold / overallTotalQuantitySold) * 100).toFixed(2) : 0,
    }));

    res.json(formattedProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
