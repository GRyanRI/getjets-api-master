// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const contact = require('../models/contact')
const Product = require('../models/product')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX - user gets an empty contact
router.get('/contact', (req, res) => {
  var contact = new contact({ items: [] })
  res.status(201).json({ contact: contact })
})
// PUT - user sends a list of items to their contact
router.patch('/contact', (req, res) => {
  console.log('req body:', req.body)
  var contact = new contact({ items: req.body.contact.items })
  var order = {}
  for (let i = 0; i < shoppingContact.length; i++) {
    console.log('inside shopping contact', shoppingContact[i])
    Product.find({_id: shoppingContact[i]})
      .then(products => {
        return products.map(product => product.toObject())
      })
      .then(products => order << products)
      // .then(console.log(products))
      // .then(products => res.status(200).json({ products: products }))
      .catch(err => handle(err, res))
  }
  console.log('order', order)
  // res.status(200).json({ shoppingContact: shoppingContact })
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/contacts/:id', requireToken, (req, res) => {
  // req.params.id will be set based on the `product id` in the route
  var productId = req.params.id
  var contact = new contact(req.session.contact ? req.session.contact : {items: {}})

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/')
    }
    contact.add(product, product.id)
    req.session.contact = contact
    console.log(req.session.contact)
    res.redirect('/')
    // .then(handle404)
    // // if `findById` is succesful, respond with 200 and "example" JSON
    // .then(contact => res.status(200).json({ contact: contact.toObject() }))
    // // if an error occurs, pass it to the handler
    // .catch(err => handle(err, res))
  })
})

// CREATE -
// POST /examples
router.post('/contacts', requireToken, (req, res) => {
  // set owner of new example to be current user
  req.body.contact.owner = req.user.id

  contact.create(req.body.contact)
    // respond to succesful `create` with status 201 and JSON of new "example"
    .then(contact => {
      res.status(201).json({ contact: contact.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/contacts/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  console.log(req.body)
  delete req.body.contact.owner

  contact.findById(req.params.id)
    .then(handle404)
    .then(contact => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, contact)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.contact).forEach(key => {
        if (req.body.contact[key] === '') {
          delete req.body.contact[key]
        }
      })

      // pass the result of Mongoose's `.update` to the next `.then`
      return contact.update(req.body.contact)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY - user can't delete contact

module.exports = router
