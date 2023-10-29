import jwt from 'jsonwebtoken';
import { User } from '../models/userModels.js';

export const isAuthenticatedUser = async (req, res, next) => {

    try {
        
        const { token } = req.cookies;
        // console.log(token)

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "You are not authenticated"
            })
        }
        // decodedData is _id of the user that is stored in token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedData.id);

        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "You are not authenticated"
        })
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Only Admin can access this resouce `
                // message: `Role: ${req.user.role} is not allowed to access this resouce `
            });
        }

        next();
    };
};
