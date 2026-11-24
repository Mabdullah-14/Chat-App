const { signup, login, verifyUser, getAllUsers } = require('../services/authServices')

const cookie_Option = {
    httpOnly: true,

    
    maxAge: 24 * 60 * 60 * 1000 
};

const handlesignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
 
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }
 
        const result = await signup({ name, email, password });
        res.cookie('token', result.token, cookie_Option);
 
        return res.status(201).json({
            success: true,
            user: result.newUser
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body; 
        const authData = await login({ email, password }); 
        
        return res
            .status(200)
            .cookie('token', authData.token, cookie_Option)
            .json({
                success: true,
                message: "Login successful.", 
                user: authData.existingUser
            });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const handleVerifyUser = async (req, res) => {
    try {
        // Ensure karein ki req.user auth middleware se aa raha hai
        const { user } = await verifyUser({ userId: req.user.id });

        return res.status(200).json({
            success: true,
            authenticated: true,
            user,
        });
    } catch (error) {
        res.clearCookie('token');
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

const handlegetUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error("Fetch users error:", error.message);
        return res.status(500).json({
            message: "Failed to fetch users list from database."
        });
    }
};

const handleLogout = async (req, res) => {
    try {
        return res.status(200)
            .clearCookie('token', cookie_Option)
            .json({ success: true, message: 'Logout successfully' });
    } catch (err) { // Fixed: error variable matching corrected
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    handlesignup,
    handleLogin,
    handleVerifyUser,
    handlegetUsers,
    handleLogout
}
