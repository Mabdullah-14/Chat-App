const {Queue} =require('bullmq')
const {redisConfig}=require('../config/reddis')

const chatQueue = new Queue('chatBackgroundPipeLine',{
    connection:redisConfig
})

const chatDLQ= new Queue('chatDeadLetterQueue',{
    connection:redisConfig
})

chatQueue.on('error',(err)=>{
   console.log('Redis/Queue error:', err.message)
})
chatQueue.waitUntilReady()
.then(()=>console.log('Queue connected to redis'))
.catch((err) => console.log('Queue connect failed:', err.message));

module.exports={chatQueue,chatDLQ}