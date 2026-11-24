const    {createBullBoard}=require('@bull-board/api')
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express')

const {chatQueue}=require('./chatQueue')

const serverAdapter=new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
      queues: [new BullMQAdapter(chatQueue)],
    serverAdapter: serverAdapter
})

module.exports=serverAdapter.getRouter()