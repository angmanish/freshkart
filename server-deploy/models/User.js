const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  landmark: { type: String },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  addresses: [addressSchema], // Add addresses array
  preferredPaymentMethod: {
    type: String,
    enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'],
    default: 'UPI',
  },
  defaultAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User.addresses', // Reference to an address within the user's addresses array
  },
  wishlistEnabled: {
    type: Boolean,
    default: true,
  },
  cartReminder: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: '',
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  resetPasswordOtp: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  resetPasswordVerified: {
    type: Boolean,
    default: false,
  },
});

// WARNING: Storing passwords in plain text is a major security risk.
// In a real application, passwords should always be hashed (e.g., using bcryptjs).

module.exports = mongoose.model('User', UserSchema);
