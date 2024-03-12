const categoryModel = require('../models/categoryModel')
const slugify = require('slugify')

const createCategoryController = async (req,res) => {
    try {
        const {name} = req.body
        if(!name){
            return res.status(401).send({
                message: 'Name is rquired'
            })
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: 'Category already Exists'
            })
        }

        const category = await new categoryModel({name, slug: slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: 'new category created',
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    }
}

const updateCategoryController =  async (req, res) => {
    try {

        const {name} = req.body
        const {id} =req.params

        const category = await categoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new: true})
        res.status(200).send({
            success: true,
            message: 'Category Updated succesfully',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while updating Category'
        })
    }
}

const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: "All Categories List successfully",
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting all categories',
            error
        })
        
    }
}

const singleCategoryController = async (req, res) => {
    try {

        const category = await categoryModel.findOne({slug: req.params.slug})
        res.status(200).send({
            success: true,
            message: "Get single category successfully",
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting single categories',
            error
        })
    }
}

const deleteCategoryController = async (req, res) => {
    try {

        const {id} = req.params
        const category = await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Category deleted successfully",
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while deleting categories',
            error
        })
    }
}
module.exports = {
    createCategoryController, 
    updateCategoryController, 
    categoryController, 
    singleCategoryController,
    deleteCategoryController
}