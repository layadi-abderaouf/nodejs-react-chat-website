const asyncHandler = require('express-async-handler');
const token = require('../config/token');
const User = require('../models/UserModel')


//signUp
const register = asyncHandler(
    async (req,res)=>{
        const {name,email,password,image} = req.body
        if(!name || !email || !password){
            res.status(400);
            throw new Error('please enter all field require')
        }

        const userExist = await User.findOne({email})
        if(userExist){
            res.status(400);
            throw new Error('user already exist')
        }

        const user = await User.create({
            name,email,password,image
        })
        if(user){
            res.status(201).json({
                _id : user._id,
                name:user.name,
                email:user.email,
                password:user.password,
                image:user.image,
                token :token(user._id)
            })
        }else{
            res.status(401)
            throw new Error('faild to create user')
        }
    }
) 

//login
const login = asyncHandler(
    async (req,res)=>{
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(user && user.matchPassword(password)){
            res.json({
                _id : user._id,
                name:user.name,
                email:user.email,
                password:user.password,
                image:user.image,
                token :token(user._id)
            })
        }else{
            res.status(401);
            throw new Error('email or password incorect')
        }
    }
) 

//get all user
const allUsers = asyncHandler(async (req,res)=>{
    const keyword = req.query.search ? {
       $or : [
           {name:{$regex:req.query.search,$options:'i'}},
           {email:{$regex:req.query.search,$options:'i'}}
        ]
    }:{}

    const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users)
    
})

module.exports = {register,login,allUsers}