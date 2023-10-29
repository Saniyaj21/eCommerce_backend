import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', required: true
    },
})

export const Cart = mongoose.model("Cart", cartSchema)
