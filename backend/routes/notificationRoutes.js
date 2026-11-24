const express = require('express');
const router = express.Router();
const { getNotifications, clearNotifications,getNotificationsStream } = require('../controller/notificationController');
const {authMiddleware}=require('../middlewares/authMidlleware')
router.get('/', authMiddleware, getNotifications);

router.post('/clear', authMiddleware, clearNotifications);

// router.get('/stream',authMiddleware,getNotificationsStream)
module.exports = router;
