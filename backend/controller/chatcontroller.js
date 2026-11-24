const { fetchChatHistory } = require('../services/chatServices');
const { chatQueue } = require('../services/chatQueue');

async function getChatHistory(req, res) {
    try {
        const me = String(req.user.id);
        

        const otherUserId = req.params.otherUserId ? String(req.params.otherUserId) : String(req.params.receiverId || req.params.senderId);

        if (!otherUserId || otherUserId === 'undefined' || otherUserId === me) {
            return res.status(400).json({ error: 'Valid other user id is required' });
        }

        const dbMessages = await fetchChatHistory({
            senderId: me,
            receiverId: otherUserId,
        });

        // BullMQ Real-time Queue Extraction
        const waitingJobs = await chatQueue.getWaiting();
        const activeJobs = await chatQueue.getActive();
        const allQueueJobs = [...waitingJobs, ...activeJobs];

        
        const unsavedMessages = allQueueJobs
            .map(job => job.data)
            .filter(msg => {
                const msgSender = String(msg.senderId);
                const msgReceiver = String(msg.receiverId);
                
                return (msgSender === me && msgReceiver === otherUserId) || 
                       (msgSender === otherUserId && msgReceiver === me);
            });

        const completeHistory = [...dbMessages, ...unsavedMessages];

        return res.status(200).json(completeHistory);
    } catch (error) {
        console.error(' Chat history error:', error.message);
        return res.status(500).json({ error: 'Failed to fetch chat history' });
    }
}

async function uploadChatFile(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    return res.status(200).json({
        fileUrl: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
    });
}

module.exports = { getChatHistory, uploadChatFile };
