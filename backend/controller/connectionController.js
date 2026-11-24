const {
  searchUserByEmail,
  connectionRequest,
  getConnectionRequests,
  respondToConnectionRequest,
  getAcceptedContacts,
} = require("../services/connectionServices");
const { getIO } = require("../config/socket"); 

const emitToUser = (userId, event, payload = {}) => {
  try {
    if (!userId) return;
    
    const targetRoom = `user:${String(userId)}`;
    
    getIO().to(targetRoom).emit(event, payload);
    console.log(` Live broadcast payload sent to: ${targetRoom} [Event: ${event}]`);
  } catch (e) {
    console.error(` Global Emit failed (${event}):`, e.message);
  }
};

const handleSearchUser = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUserId = req.user.id;

    const user = await searchUserByEmail(email, currentUserId);

    return res.status(200).json({
      success: true,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const handleSendRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { receiverId } = req.body;

    const connection = await connectionRequest(requesterId, receiverId);

    emitToUser(receiverId, "new_connection_request", {
      senderId: String(requesterId),
    });

    return res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      data: connection,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const handleConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await getConnectionRequests(userId);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const handleRespondToRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { status } = req.body;
    const userId = String(req.user.id);

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected",
      });
    }

    const updatedConnection = await respondToConnectionRequest(
      connectionId,
      status,
      userId
    );

    if (status === "accepted") {

      const requesterId =
        updatedConnection?.requesterId ??
        updatedConnection?.senderId ??
        updatedConnection?.requester_id ??
        updatedConnection?.requester?.id ?? 
        updatedConnection?.sender?.id;

      if (requesterId) {
        emitToUser(requesterId, "connection_accepted", { connectionId });
      } else {
        console.warn(" requesterId context extraction failed entirely on response:", updatedConnection);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Connection request ${status} successfully`,
      data: updatedConnection,
    });
  } catch (error) {
    const statusCodes = {
      "Connection request not found": 404,
      "You are not allowed to respond to this request": 403,
      "This request has already been processed": 400,
      "Invalid Connection request status": 400,
    };

    return res.status(statusCodes[error.message] || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const handlegetMyContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const contacts = await getAcceptedContacts(userId);

    return res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleSearchUser,
  handleSendRequest,
  handleConnectionRequests,
  handleRespondToRequest,
  handlegetMyContacts,
};
