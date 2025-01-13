const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  unit: { 
    type: String, 
    required: true 
  },
  tag: { 
    type: String, 
    enum: ["kırtasiye", "temizlik", "diğer"], 
    required: true 
  },
  imageUrl: { 
    type: String 
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published'
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  soldQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 