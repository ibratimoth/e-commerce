const productModel = require('../models/productModel')
const fs = require('fs')
const slugify = require('slugify')
const orderModel = require('../models/orderModel')
const categoryModel = require('../models/categoryModel')
var braintree = require("braintree");
const dotenv = require('dotenv')
dotenv.config()

//payment gateway
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping} = req.fields
        const {photo} = req.files
        //validation
        if(!name || !description || !price || !category || !quantity || photo && photo.size > 1000000){
            return res.send({
                message: 'All fields must be filled and photo should be less than 1MB'
            })
        }
        const products = new productModel({...req.fields, slug: slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product created successfully',
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while creating product',
            error
        })
    }
}
const getProductController = async(req, res) => {
    try {
        
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt: -1})
        res.status(201).send({
            success: true,
            countTotal: products.length,
            message: 'Get All products',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting all products',
            error
        })
    }
}

const getSingleProductController = async(req, res) => {
    try {
        const product = await productModel.findOne({slug: req.params.slug}).select("-photo").populate('category')
        res.status(200).send({
            success: true,
            message: 'Single Product fetched',
            product,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while getting single products',
            error
        })
    }
}

const productPhotoController = async(req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type', product.photo.contentType)
            res.status(200).send(product.photo.data)
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while getting product photo',
            error
        })
    }
}

const deleteProductController = async(req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: 'Product Deleted successfully',
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while deleting product photo',
            error
        })
    }
}
const updateProductController = async(req, res) => {

    try {
        const { name, slug, description, price, category, quantity, shipping} = req.fields
        const {photo} = req.files
        //validation
        if(!name || !description || !price || !category || !quantity || photo && photo.size > 1000000){
            return res.send({
                message: 'All fields must be filled and photo should be less than 1MB'
            })
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug: slugify(name)}, {new: true})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product updated successfully',
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while updating product',
            error
        })
    }
}

const productFiltersController = async (req, res) => {
    try {
        const {checked, radio} = req.body

        let args = {}
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte : radio[0], $lte: radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while filtering product',
            error
        })
    }
}

const productCountController = async (req, res) => {
    try {
        
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: 'Error in product count',
            error
        })
    }
}

const productListController = async (req, res) => {
    try {
        
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const products = await productModel
        .find({})
        .select("-photo")
        .skip((page-1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1})
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in per page ctrl',
            error
        })
    }
}

const searchProductController = async(req, res) => {
    try {
        
        const {keyword} = req.params

        const result = await productModel.find({
            $or: [
                {name: {$regex : keyword, $options: "i"}},
                {description: {$regex : keyword, $options: "i"}}
            ]
        }).select("-photo")
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in Search Product API',
            error
        })
    }
}

const relatedProductController = async(req, res) => {
    try {
        
        const {pid, cid} = req.params

        const products = await productModel.find({
            category: cid,
            _id: {$ne: pid}
        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while getting similar product',
            error
        })
    }
}

const productCategoryController = async(req, res) => {
    try {
        const category = await categoryModel.findOne({slug: req.params.slug})
        const products = await productModel.find({category}).populate('category')
        res.status(200).send({
            success: true,
            category,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while getting products',
            error
        })
    }
}

const braintreeTokenController = async (req, res) => {

    try {
        gateway.clientToken.generate({}, function(err, response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce} = req.body
        let total = 0
        cart.map((i) => {total += i.price})
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
        function(error, result){
            if(result){
                const order = new orderModel({
                    products: cart,
                    payment: result,
                    buyer: req.user._id
                }).save()
                res.json({ok: true})
            }else{
                res.status(500).send(error)
            }
        }
        )
    } catch (error) {
        console.log(error)
    }
}
module.exports = {createProductController, 
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
}