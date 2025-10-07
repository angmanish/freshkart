const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart'); // Import Cart model
const Product = require('../models/Product'); // Import Product model
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware

module.exports = (io) => {

  // Get total order count
  router.get('/count', async (req, res) => {
    try {
      const count = await Order.countDocuments();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all orders with pagination
  router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      const orders = await Order.find()
        .populate('items.productId')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await Order.countDocuments();
      res.json({
        orders,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Place a new order
  router.post('/', async (req, res) => {
    const { userId, shippingAddress, billingAddress, paymentMethod } = req.body;

    try {
      const cart = await Cart.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Calculate totals from cart items
      const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const totalDiscount = cart.items.reduce((acc, item) => {
        const itemDiscount = item.discount ? (item.price * item.quantity * item.discount) / 100 : 0;
        return acc + itemDiscount;
      }, 0);
      const priceAfterDiscount = subtotal - totalDiscount;
      const gstRate = 0.18; // Assuming 18% GST
      const gstAmount = priceAfterDiscount * gstRate;
      const shippingCharge = 5.00; // Assuming flat $5 shipping
      const totalAmount = priceAfterDiscount + gstAmount + shippingCharge;

      const newOrder = new Order({
        userId,
        items: cart.items.map(item => ({
          productId: item.productId,
          name: item.name,
          imageUrl: item.imageUrl,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
        })),
        shippingAddress,
        billingAddress,
        paymentMethod,
        subtotal,
        totalDiscount,
        gstAmount,
        shippingCharge,
        totalAmount,
      });

      await newOrder.save();

      // Clear the user's cart after placing the order
      cart.items = [];
      await cart.save();

      io.emit('new_order', newOrder);

      res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get total revenue
  router.get('/revenue', async (req, res) => {
    try {
      const result = await Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]);
      res.json({ totalRevenue: result.length > 0 ? result[0].totalRevenue : 0 });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all orders for a user
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("items.productId", "name price imageUrl");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/status-counts", async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const counts = {};
    statusCounts.forEach((item) => {
      counts[item._id] = item.count;
    });

    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/statuses", (req, res) => {
  try {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("userId", "name email")
      .populate("items.productId", "name price imageUrl");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  // Get a specific order by ID
  router.get('/details/:orderId', async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId).populate('items.productId');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Update order status
  router.put('/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const oldStatus = order.orderStatus;

      // Quantity reduction when order is confirmed (from Pending)
      if (status === 'Confirmed' && oldStatus === 'Pending') {
        for (const item of order.items) {
          const product = await Product.findById(item.productId);
          if (product) {
            if (product.quantity >= item.quantity) {
              product.quantity -= item.quantity;
              await product.save();
            } else {
              return res.status(400).json({ message: `Not enough stock for product ${product.name}` });
            }
          }
        }
      }

      // Quantity restoration when order is cancelled
      if (status === 'Cancelled' && oldStatus !== 'Cancelled' && oldStatus !== 'Delivered') {
        for (const item of order.items) {
          const product = await Product.findById(item.productId);
          if (product) {
            product.quantity += item.quantity;
            await product.save();
          }
        }
      }

      order.orderStatus = status;
      await order.save();

      io.emit('order_status_updated', order); // Emit event with updated order

      res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get order counts by status
  router.get('/status-counts', async (req, res) => {
    try {
      const statusCounts = await Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
      ]);
      
      const counts = {};
      statusCounts.forEach(item => {
        counts[item._id] = item.count;
      });

      res.json(counts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all unique order statuses
  router.get('/statuses', async (req, res) => {
    try {
      const statuses = await Order.distinct('orderStatus');
      res.json(statuses);
    } catch (err) {
      console.error('Error fetching unique order statuses:', err);
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};