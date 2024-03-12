const express = require('express')
const { isAdmin, requireSignIn } = require('../middlewares/authMiddleware')
const { createCategoryController, 
    updateCategoryController,
categoryController,
singleCategoryController,
deleteCategoryController} = require('../controllers/categoryController')

const router = express.Router()
//create category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

//Update Category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

//getAll
router.get('/get-category', categoryController)

//get Single category
router.get('/single-category/:slug',singleCategoryController)

//Delete Category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)
module.exports = router