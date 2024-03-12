const mongoose = require('mongoose')
const db = require('../config/db')

const categorySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        lowercase: true
    }
})

module.exports = db.model('Category', categorySchema)