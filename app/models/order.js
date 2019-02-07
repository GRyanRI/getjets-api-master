const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    type: Array,
    required: true
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)
