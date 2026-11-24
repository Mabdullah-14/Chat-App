const express = require('express');
const { authMiddleware } = require('../middlewares/authMidlleware');
const { uploadSingleFile } = require('../middlewares/upload');
const { getChatHistory, uploadChatFile } = require('../controller/chatcontroller');

const router = express.Router();

router.get('/history/:receiverId', authMiddleware, getChatHistory);

router.post('/upload', authMiddleware, uploadSingleFile, uploadChatFile);

module.exports = router;