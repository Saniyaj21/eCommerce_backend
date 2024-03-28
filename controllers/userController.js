import { User } from '../models/userModels.js';
import sendToken from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body
   

        const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
            folder: "sampleFolder",
            width: 250,
            crop: "scale",
        });

        //if user exists return error
        let user = await User.findOne({ email })  // shortHand for email:email
        if (user) return res.status(400)
            .json({ success: false, message: "User already exists." })

        // creating user
        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        });
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,);

        user.token = token;
        user.save();


        res.status(200).json({
            success: true,
            token,
            user,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Can't register"
        })
    }
}


export const login = async (req, res) => {

    try {

        const { email, password } = req.body
        
        // checking if user has given password and email both
        
        
        const user = await User.findOne({ email }).select("+password");
        
        if (!user) {
            return res.status(400)
            .json({
                success: false,
                message: "Invalid email or password"
            })
        }
        
        const isPasswordMatched = await user.comparePassword(password);
        
        if (!isPasswordMatched) {
            return res.status(400)
            .json({
                success: false,
                message: "Invalid email or password"
            })
        }
        
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        

        user.token = token;
        user.save();


        res.status(200).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Can't Login"
        })
    }
}

// logout

export const logout = async (req, res, next) => {

 try {
    const id = req.user._id
    const user = await User.findById(id)

    user.token = undefined
    user.save();
    res.status(200).json({
        success: true,
        logOut: true,
    });
 } catch (error) {
    res.status(400).json({
        success: false,
        message: "Logged failed",
    });
 }
};


// forgot password
export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // otp method
        const resetOTP = user.getResetPasswordOTP();

        await user.save({ validateBeforeSave: false });

        const message = `Your password reset OTP is :- \n\n ${resetOTP} \n\nIf you have not requested this email then, please ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: `Ecommerce Password Recovery`,
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully`,
            });
        } catch (error) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const resetPassword = async (req, res, next) => {
    // this will be a patch request with otp and new password and confirm password
    const { resetPasswordOTP, password, confirmPassword } = req.body;

    const user = await User.findOne({
        resetPasswordOTP,
        // resetPasswordOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Reset Password OTP is invalid or has been expired",
        });
    }


    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and confirm password does not matched",
        });
    }

    if (user.verifyResetPasswordOTP(resetPasswordOTP)) {
        user.password = password;

        // Clear the OTP and its expiration time
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,);

        user.token = token;
        user.save();


        res.status(200).json({
            success: true,
            token,
            user
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Cant't verify your otp",
        });
    }

};

// get user details
export const getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

//   update password
// patch : oldPassword, newPassword, confirmPassword
export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("+password");


        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "old password does not matched",
            });
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm Password should be same",
            });
        }

        user.password = req.body.newPassword;

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,);

        user.token = token;
        user.save();
    
    
        res.status(200).json({
          success: true,
          token,
          user,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};





//   update user profile
// patch : 
export const updateProfile = async (req, res) => {
    try {

        const newUserData = {
            name: req.body.name,
            email: req.body.email,
        };

        let prefix = "https://res.cloudinary.com";

        if (!req.body.avatar.startsWith(prefix)) {
            const user = await User.findById(req.user.id);

            const imageId = user.avatar.public_id;

            await cloudinary.uploader.destroy(imageId);

            const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
                folder: "sampleFolder",
                width: 250,
                crop: "scale",
            });

            newUserData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all users(admin)
export const getAllUser = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get single user (admin)
export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorHander(`User does not exist with Id: ${req.params.id}`)
            );
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

// update User Role -- Admin
export const updateUserRole = async (req, res) => {
    try {
        const newUserData = {
            // we will do patch request so dont need extra data
            // name: req.body.name,
            // email: req.body.email,
            role: req.body.role,
        };

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};
// delete User Role -- Admin
export const deleteUser = async (req, res) => {
    try {



        const user = await User.findByIdAndDelete(req.params.id);
        const imageId = user.avatar.public_id;

        await cloudinary.uploader.destroy(imageId);


        res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};


