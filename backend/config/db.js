const mongoose = require('mongoose')
const colors = require('colors')

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URL)
//         console.log(`Connected to MongoDb Database ${conn.connection.host}`.bgMagenta.white)
//     } catch (error) {
//         console.log(`Error in MongoDb ${error}`.bgRed.white)
//     }
// }
const connectDB =mongoose.createConnection('mongodb://127.0.0.1:27017/ecommerce').on('open',() => {
    console.log('Connected to MongoDb Database'.bgMagenta.white);
}).on('error',() => {
    console.log('MongoDb connection error'.bgRed.white);
});


module.exports = connectDB;