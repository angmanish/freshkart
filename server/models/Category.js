const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null, // Null for top-level categories
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subcategories: [
    {
      type: String,
    },
  ],
});
module.exports = mongoose.model('Category', CategorySchema);
