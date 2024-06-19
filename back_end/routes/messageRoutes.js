const express = require('express')
const {getMessages,sendMessage} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router()


//get
router.get('/:chatId',[protect,getMessages])
//post
router.post('/',[protect,sendMessage])


module.exports = router;