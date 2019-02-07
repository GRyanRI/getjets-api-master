// Javascript constructor function of contact model.
// id = view-contact
module.exports = function contact (oldContact) {
  this.items = oldContact.items || {}
  this.totalQty = oldContact.totalQty || 0
  this.totalPrice = oldContact.totalPrice || 0

  this.add = function (item, id) {
    // see if the same product is being added onto the contact. To update quantity
    // in the new contact being generated from the old contact
    var storedItem = this.items[id]
    if (!storedItem) { // if theres no storedItem, set qty and price to 0
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 }
    }
    storedItem.qty++
    storedItem.price = storedItem.item.price * storedItem.qty
    this.totalQty++
    this.totalPrice += storedItem.item.price
  }
  // put items in contact into an array
  this.generateArray = function () {
    var arr = []
    for (var id in this.items) {
      arr.push(this.items[id])
    }
    return arr
  }
}

// below is the mongoose model if contact is being saved in database.
// const mongoose = require('mongoose')
//
// const contactSchema = new mongoose.Schema({
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// },
// {
//   timestamps: true,
//   toObject: { virtuals: true },
//   toJSON: { virtuals: true }
// })
//
// contactSchema.virtual('subtotal').get(function () {
//   // add up prices of all products' in contact
//   // return this.
// })
// contactSchema.virtual('tax').get(function () {
//   // multiply subtotal with 0.07 (tax = 7%)
//   // return this.
// })
// contactSchema.virtual('total').get(function () {
//   // subtotal + tax
//   // return this.
// })
//
// module.exports = mongoose.model('contact', contactSchema)
