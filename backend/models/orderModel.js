const mongoose = require('mongoose')
const db = require('../config/db')

const orderSchema = new mongoose.Schema({
    products : [{
        type: mongoose.ObjectId,
        ref: "Product"
    },
],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: 'Not Process',
        enum: ['Not Process', 'Processing', "Shipped", "delivered", "cancel"]
    },
}, { timestamps: true})

module.exports = db.model('Order', orderSchema)