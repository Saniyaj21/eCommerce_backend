
import { Cart } from "../models/cartModel.js";


export const fetchCartByUser = async (req, res) => {
  try {

    const { id } = req.user;


    const cart = await Cart.find({ user: id }).populate('product').exec();

    res.status(200).json({ cartItems: cart });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  const { id } = req.user;
  try {

    const cart = await Cart.create({ ...req.body, user: id });

    const result = await cart.populate('product');

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
export const deleteFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Cart.findOneAndDelete({ _id: id });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateCart = async (req, res) => {
  const { id } = req.params;

  try {
   

    const cart = await Cart.findOneAndUpdate({ _id: id }, {
      quantity: req.body.quantity
    }, {
      new: true,
    });  

    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json(err);
  }
};