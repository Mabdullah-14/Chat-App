const express=require('express')
const router=express.Router()
const {authMiddleware} =require('../middlewares/authMidlleware')
const {
     handleSearchUser,
    handleSendRequest,
    handleConnectionRequests,
    handleRespondToRequest,
    handlegetMyContacts
} =require('../controller/connectionController')


router.post('/search',authMiddleware,handleSearchUser)

router.post('/request',authMiddleware,handleSendRequest)

router.get('/requests/incoming',authMiddleware,handleConnectionRequests)

router.put('/request/:connectionId/respond',authMiddleware,handleRespondToRequest)

router.get('/contacts',authMiddleware,handlegetMyContacts)

module.exports=router
    
