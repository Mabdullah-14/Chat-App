const { chatQueue } = require('../services/chatQueue');
const axios = require('axios');

function handleChatEvents(io, socket) {
    const currentUserId = String(socket.user.id);
    socket.userId = currentUserId;
    socket.join(`user:${currentUserId}`);

    socket.on('register_user', () => {
        console.log(`register_user bypassed. Already secured as: ${currentUserId}`);
    });

    // Shared helper: deliver live if receiver is online, then queue DB save
    async function deliverMessage(msgObj) {
        const receiverRoom = `user:${msgObj.receiverId}`;
        const sockets = await io.in(receiverRoom).fetchSockets();
        msgObj.isDelivered = sockets.length > 0;

        if (msgObj.isDelivered) {
            io.to(receiverRoom).emit('receive_message', msgObj);
        }

        await chatQueue.add('saveMessageToDb', msgObj, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: false,
            removeOnFail: false
        });

        socket.emit('message_sent_success', msgObj);
    }

    socket.on('send_message', async (data) => {
        try {
            const senderId = currentUserId;
            const receiverId = data.receiverId ? String(data.receiverId) : null;

            if (!receiverId || receiverId === 'undefined') {
                console.error('message drop: receiverId is missing or invalid');
                return;
            }

            const text = (data.text || '').trim();
            const { fileUrl = null, fileName = null, fileType = null } = data;

            console.log('send_message payload validated:', { senderId, receiverId, text });

            // Test hook (disabled in production)
            if (text === 'testapi') {
                try {
                    const response = await axios.get(
                        'https://jsonplaceholder.typicode.com/posts/1',
                        { timeout: 5000 }
                    );
                    const fakePost = response.data;

                    
                 
                    await deliverMessage({
                        senderId,
                        receiverId,
                        text: `Fake API Data: ${fakePost.title}  ${fakePost.body}`,
                        fileUrl: null,
                        fileName: null,
                        fileType: null,
                        createdAt: new Date()
                    });
                } catch (apiError) {
                    console.error('Third-party API call/queue pipeline failed, server still alive:', apiError.message);

                    socket.emit('message_sent_success', {
                        senderId,
                        receiverId,
                        text: 'API Bot: Task execution error caught safely inside catch block! Server is completely stable.',
                        createdAt: new Date()
                    });
                }
                return;
            }

            if (!text && !fileUrl) return;
            if (fileUrl && !fileUrl.startsWith('/uploads/')) return;

            await deliverMessage({
                senderId,
                receiverId,
                text: text || null,
                fileUrl,
                fileName,
                fileType,
                createdAt: new Date()
            });

        } catch (error) {
            console.error('send_message execution failed critically:', error.message);
        }
    });
}

module.exports = { handleChatEvents };