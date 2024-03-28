import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // resetPasswordToken: String,
  // resetPasswordExpire: Date,


  resetPasswordOTP: String,
  resetPasswordOTPExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); //entered password, hashed password
};



userSchema.methods.getResetPasswordOTP = function () {
  // Generating OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP and its expiration time
  this.resetPasswordOTP = otp;
  this.resetPasswordOTPExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  return otp;
};


userSchema.methods.verifyResetPasswordOTP = function (otp) {
  // Check if the OTP is valid and has not expired
  return (
    this.resetPasswordOTP === otp &&
    this.resetPasswordOTPExpire &&
    this.resetPasswordOTPExpire > Date.now()
  );
};


export const User = mongoose.model("User", userSchema)
