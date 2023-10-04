import { Order } from "../models/orderModel.js";
import { Product } from '../models/product.js';


export const newOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;


        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user.id,
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// get Single Order
export const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );


        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// get logged in user  Orders
export const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });

        if (!orders) {
            return res.status(400).json({
                success: false,
                message: "no order found"
            });
        }

        res.status(201).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// get all Orders -- Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        let totalAmount = 0;

        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// update Order Status -- Admin
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "order not found"
            });
        }

        if (order.orderStatus === "Delivered") {
            return res.status(404).json({
                success: false,
                message: "You have already delivered this order"
            });
        }

        if (req.body.status === "Shipped") {
            order.orderItems.forEach(async (o) => {
                await updateStock(o.product, o.quantity);
            });
        }
        order.orderStatus = req.body.status;

        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,

        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

async function updateStock(id, quantity) {
    try {
        const product = await Product.findById(id);

        product.Stock -= quantity;

        await product.save({ validateBeforeSave: false });
    } catch (error) {
        console.log(error)
    }
}


// delete Order -- Admin
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({_id:req.params.id});

        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};