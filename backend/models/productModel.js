const mongoose = require('mongoose')
const db = require('../config/db')

const productSchema =  new mongoose.Schema({
    name : {
        type: String,
        required :  true
    },
    slug: {
        type: String,
        required:  true
    },
    description: {

    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true
    },
    quantity : {
        type: Number,
        required: true
    },
    photo: {
        data : Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean,
    }
}, {timestamps: true})

module.exports = db.model('Product', productSchema)