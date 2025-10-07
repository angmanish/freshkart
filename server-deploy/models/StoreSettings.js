const mongoose = require('mongoose');

const StoreSettingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    default: 'D-Mart',
  },
  address: {
    type: String,
    default: '123 Main Street, Anytown, USA',
  },
  phone: {
    type: String,
    default: '123-456-7890',
  },
  email: {
    type: String,
    default: 'support@dmart.com',
  },
  // Add other settings as needed
});

module.exports = mongoose.model('StoreSettings', StoreSettingsSchema);
