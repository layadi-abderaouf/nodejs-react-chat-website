const asyncHandler = require('express-async-handler');
const Chat = require('../models/ChatModels');
const User = require('../models/UserModel');


const create_Chat = asyncHandler(async (req,res)=>{
    const {userId} = req.body
    if(!userId){
        return res.sendStatus(400)
    }
    var isChatExist = await Chat.find({
        isGroup:false,
        $and:[
            {users :{$elemMatch:{$eq:req.user._id}}},
            {users :{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users",'-password').populate("latestMessage")

    isChatExist = await User.populate(isChatExist,{
        path : "letastMesssage.sender",
        select: "name image email"
    })

    if(isChatExist.length >0){
        res.send(isChatExist[0])
    }else{
        var chatData = {
            chatName:"sender",
            isGroup:false,
            users:[req.user._id,userId]
        }
        try {
            const chat = await Chat.create(chatData)
            const fullChat= await Chat.findById(chat._id).populate("users",'-password')
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})
const create_Group = asyncHandler(async (req,res)=>{
    if(!req.body.users || !req.body.name){
       return res.status(400).send({message:"please fill all field"})
    }
    var users = JSON.parse(req.body.users)
    if(users.length < 2){
        return res.status(400).send("require more then 2 users")
    }
    users.push(req.user)
    try {
        const group = await Chat.create({
            chatName : req.body.name,
            users:users,
            isGroup:true,
            groupAdmin:req.user
        })
        const fullgroupChat= await Chat.findById(group._id)
        .populate("users",'-password')
        .populate("groupAdmin",'-password')
        res.status(200).send(fullgroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})
const get_Chats = asyncHandler(async (req,res)=>{
    try {
        await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async (resault)=>{
           resault = await User.populate(resault,{
            path : "letastMesssage.sender",
            select: "name image email"
           })
           res.status(200).send(resault)
        })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})
const group_Rename = asyncHandler(async (req,res)=>{
    const {chatId,name} = req.body
    
    try {
        const update = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName:name
            },{new:true}
        ).populate("users","-password")
         .populate("groupAdmin","-password")
        if(!update){
            res.status(404)
            throw new Error("chat not found")
        }else{
            res.json(update)
        }
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})
const add_User_To_Group = asyncHandler(async (req,res)=>{
    const {chatId,userId} = req.body
    
    try {
        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
              $push:{users:userId}
            },{new:true}
        ).populate("users","-password")
         .populate("groupAdmin","-password")
        if(!added){
            res.status(404)
            throw new Error("chat not found")
        }else{
            res.json(added)
        }
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})
const remove_User_From_Group = asyncHandler(async (req,res)=>{
    const {chatId,userId} = req.body
    
    try {
        const deleted = await Chat.findByIdAndUpdate(
            chatId,
            {
              $pull:{users:userId}
            },{new:true}
        ).populate("users","-password")
         .populate("groupAdmin","-password")
        if(!deleted){
            res.status(404)
            throw new Error("chat not found")
        }else{
            res.json(deleted)
        }
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = {
    create_Chat,
    create_Group,
    get_Chats,
    group_Rename,
    add_User_To_Group,
    remove_User_From_Group
}