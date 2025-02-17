const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

// Register

const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.json({ success: false, message: "User already exists with this email! Please try another email" });
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
        })
        await newUser.save();
        res.status(200).json({
            success: true,
            message: "User created successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

// Login

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.json({ success: false, message: "User not found with this email! Please register first" });
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if (!checkPassword) {
            return res.json({ success: false, message: "Invalid password" });
        }
        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            userName: checkUser.userName,
        }, 'CLIENT_SECRET_KEY', { expiresIn: '60m' })

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: true,
        // }).json({
        //     success: true,
        //     message: "User logged in successfully",
        //     user: {
        //         userName: checkUser.userName,
        //         email: checkUser.email,
        //         role: checkUser.role,
        //         userName: checkUser.userName,
        //     }
        // });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                userName: checkUser.userName,
                email: checkUser.email,
                role: checkUser.role,
                userName: checkUser.userName,
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

// Logout

const logoutUser = async (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: "Logged out successfully!"
    })
}

// auth middleware

// For sub domains for cookies
// const authMiddleware = async (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized user!"
//         })
//     }
//     try {
//         const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized user!"
//         })
//     }
// }

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user!"
        })
    }
    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user!"
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware,
}