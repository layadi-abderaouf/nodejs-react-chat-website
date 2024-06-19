const express = require('express')
const {register,login,allUsers} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router()

//post routes
router.post('/',register);
router.post('/login',login);

//get routes
router.get('/',[protect,allUsers]);



module.exports = router;