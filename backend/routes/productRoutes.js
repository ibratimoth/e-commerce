const express = require('express')
const {
    createProductController, 
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFiltersController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentController
} = require('../controllers/productController')
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware')
const formidable = require('express-formidable')
const router = express.Router()

//routes
router.post('/create-product', requireSignIn, isAdmin,formidable(), createProductController)

//update products
router.put('/update-product/:pid', requireSignIn, isAdmin,formidable(), updateProductController)

//get products
router.get('/get-product', getProductController)

//single product
router.get('/get-product/:slug', getSingleProductController)
//get photos
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete('/delete-product/:pid', deleteProductController)

//filter product
router.post('/product-filters', productFiltersController)

//product count
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword', searchProductController)

//similar products
router.get('/related-product/:pid/:cid', relatedProductController)

//category wise product
router.get('/product-category/:slug', productCategoryController)

//payments routes
//token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController)
module.exports = router