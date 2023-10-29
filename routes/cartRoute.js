import express from 'express';
import { isAuthenticatedUser } from '../middleware/auth.js';
import { addToCart, deleteFromCart, fetchCartByUser, updateCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/',isAuthenticatedUser, addToCart)
      .get('/items', isAuthenticatedUser, fetchCartByUser)
      .delete('/delete/:id',isAuthenticatedUser, deleteFromCart)
      .patch('/:id',isAuthenticatedUser, updateCart)

export default router;