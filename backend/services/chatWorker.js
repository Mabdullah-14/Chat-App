const { Worker  } = require('bullmq');
const { redisConfig } = require('../config/reddis'); 
const { prisma } = require('../config/db');
const {chatDLQ} =require('./chatQueue')

const chatWorker = new Worker('chatBackgroundPipeLine', async (job) => {
   
   if (job.name === 'saveMessageToDb') {
      const msgObj = job.data; 
      
      console.log(` [Worker] Saving message for job ${job.id}`);

      await prisma.message.create({
          data: {
              senderId: msgObj.senderId,
              receiverId: msgObj.receiverId,
              text: msgObj.text,
              fileUrl: msgObj.fileUrl,
              fileName: msgObj.fileName,
              fileType: msgObj.fileType,
              isDelivered: msgObj.isDelivered,
              createdAt: new Date(msgObj.createdAt)
          }
      });
   }
   
}, {
    connection: redisConfig,
    concurrency: 10
});

chatWorker.on('completed', (job) => {
     console.log(`[Trace System] Job ${job.id} state changed to: COMPLETED`);
});

chatWorker.on('failed', async (job, err) => {
    console.log(`[Alert System] Job ${job?.id} critically failed: ${err.message}`);
      if(job && job.attemptsMade >=job.opts.attempts){
        console.error(`[DLQ System] Job ${job.id} completely failed after ${job.attemptsMade} retries. Moving to DLQ...`);
        try{
            await chatDLQ.add('failedMessageBackup',{
                originalData:job.data,
                failedAt:new Date().toISOString(),
                errorReason:err.message,
                originalJobId:job.id
            },{
                removeOnComplete:true
            })
            await job.remove()

     }catch(error){
        console.log(error)
     }
      }
     
});

module.exports = chatWorker;
