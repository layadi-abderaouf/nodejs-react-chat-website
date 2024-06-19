const express = require('express');
const { create_Chat, create_Group, get_Chats, group_Rename, add_User_To_Group, remove_User_From_Group } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

//post 
router.post('/',[protect,create_Chat])
router.post('/group',[protect,create_Group])

//get
router.get('/',[protect,get_Chats])

//put
router.put('/group/rename',[protect,group_Rename])
router.put('/group/add',[protect,add_User_To_Group])
router.put('/group/remove',[protect,remove_User_From_Group])



module.exports = router;
