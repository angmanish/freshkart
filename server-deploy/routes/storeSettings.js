const express = require('express');
const router = express.Router();
const StoreSettings = require('../models/StoreSettings');

// Get store settings
router.get('/', async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      // If no settings exist, create a new one with default values
      settings = new StoreSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update store settings
router.put('/', async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings();
    }

    settings.storeName = req.body.storeName || settings.storeName;
    settings.address = req.body.address || settings.address;
    settings.phone = req.body.phone || settings.phone;
    settings.email = req.body.email || settings.email;

    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
