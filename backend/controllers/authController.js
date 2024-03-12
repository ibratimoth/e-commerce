const userModel = require('../models/userModel')
const orderModel = require('../models/orderModel')
const {hashPassword, comparePassword} = require('../helpers/authHelper')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const registerController = async (req,res) => {
    try {

        const {name, email, password, phone, address, answer} = req.body

        //validation
        if(!name || !email || !password || !phone || !address || !answer){
            return res.send({
                message: 'All fields must be filled'
            })
        }

        if(!validator.isEmail(email)){
            return res.send({
                message: 'Email is not valid'
            })
        }

        if(!validator.isStrongPassword(password)){
            return res.send({
                message: 'Password is not strong include uppercase, lowercase and characters'
            })
        }
        //existing user
        const existingUser = await userModel.findOne({email: email})

        if(existingUser){
            return res.status(200).send({
                success: false,
                message: 'Already Registered please login',
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)

        //save
        const user = new userModel({name, email, phone, address, password: hashedPassword, answer}).save()

        res.status(201).send({
            success: true,
            message: "User Registered successfully",
            user
        })
    } catch (error) { 
        console.log(error)
        res.status().send({
            success: false,
            message:'Error in Registration',
            error
        })
    }
}

//POST LOGIN
const loginController = async (req,res) => {
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(404).send({
                success: false,
                message: 'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password)

        if(!match){
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }

        const token = await jwt.sign({_id: user._id},process.env.JWT_SECRET,{
            expiresIn: "7d",
        })
        res.status(200).send({
            success: true,
            message: 'login successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message:'Error in Login',
            error
        })
    }
}

//forgot-Password Controller
const forgotPasswordController = async (req, res) => {
    try {
        const {email, answer, newPassword} = req.body

        if(!email || !answer || !newPassword){
            res.status(400).send({
                message: 'All fields must be filled'
            })
        }

        //check
        const user = await userModel.findOne({email, answer})
        //validation
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'Wrong Email Or Answer'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, {password: hashed})
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
};

const testController = (req, res) => {

    try {
        res.send("Protected Routes")
    } catch (error) {
        console.log(error)
        res.send({ error })
    }
}

const updateProfileController = async(req, res) => {
    try {
        
        const {name, email, password, address, phone} = req.body
        const user = await userModel.findById(req.user._id)

        //password
        if(!validator.isEmail(email)){
            return res.send({
                message: 'Email is not valid'
            })
        }

        if(validator.isStrongPassword(password)){
            return res.send({
                message: 'Password is not strong include uppercase, lowercase and characters'
            })
        }

        const hashedPassword = password ? await hashPassword(password) : undefined

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        },{new: true})
        res.status(200).send({
            success: true,
            message: "Profile Updated Succesfully",
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error while Update Profile",
            error
        })
    }
}

const getOrdersController = async(req, res) => {
    try {
        const orders = await orderModel.find({buyer: req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting Orders",
            error
        })
    }
}

const getAllOrdersController = async(req, res) => {
    try {
        const orders = await orderModel
        .find({})
        .populate("products","-photo")
        .populate("buyer","name")
        .sort({createdAt: -1})
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting Users Orders",
            error
        })
    }
}

const orderStatusController = async (req, res) => {
    try {
        
        const { orderId} = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new: true})
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while updating User Orders",
            error
        })
    }
}
module.exports = {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController
}