const jwt = require('jsonwebtoken');
const User = require('../Models/user');

exports.isAuth = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ UserName: decode.UserName });
            if (!user) {
                res.status(401).json({ success: false, message: 'Unauthorized access,no user found!' });
            } else {
                req.user = user;
                next();
            }
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized access!' });
        }
    } catch (error) {
        console.error('Error in authentication:', error);
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ success: false, message: 'Token has expired' });
        } else {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
};
