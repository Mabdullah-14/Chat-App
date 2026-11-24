const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');

const { connectDB } = require('./config/db');
const { initSocket } = require('./config/socket');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes=require('./routes/notificationRoutes')
const connectionRoutes=require('./routes/connectionRoutes')

const bullBoardRouter=require('./services/bullboard')

const initDatabaseBackup=require('./jobs/databaseBackup')
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

app.use('/admin/queues',bullBoardRouter)

app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser()); 

initDatabaseBackup()

app.get('/', (req, res) => {
    res.send('API is running successfully');
});

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/notifications', notificationRoutes); 
app.use('/connections',connectionRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
async function start() {
    try {
        await connectDB();
        await initSocket(server);

        require('./services/chatWorker')
        server.listen(PORT, () => {
            console.log(`This app is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Server not be started:', err.code || '', err.message || err);
        process.exit(1);
    }
}

start();
