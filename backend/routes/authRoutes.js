const express = require('express');
const router = express.Router();
const { handlesignup, handleLogin, handleVerifyUser,handlegetUsers,handleLogout } = require('../controller/authController');
const { authMiddleware } = require('../middlewares/authMidlleware');

router.post('/signup', handlesignup);
router.post('/login', handleLogin);

router.get('/verify-user', authMiddleware, handleVerifyUser);

router.get('/users',authMiddleware,handlegetUsers)
router.post('/logout',handleLogout)



module.exports = router;