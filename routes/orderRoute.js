import express from 'express';
import { deleteOrder, getAllOrders, getSingleOrder, myOrders, newOrder, updateOrder } from '../controllers/orderController.js';
import {authorizeRoles, isAuthenticatedUser} from '../middleware/auth.js'


const router = express.Router();

router.post('/new',isAuthenticatedUser,newOrder)
router.get('/me',isAuthenticatedUser, myOrders)
router.get('/:id',isAuthenticatedUser,getSingleOrder)

router.get('/admin/allorders',isAuthenticatedUser,authorizeRoles("admin"),getAllOrders)
router.patch('/admin/update/:id',isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
router.delete('/admin/delete/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)

export default router

// new order dummy data

// {
//     "shippingInfo": {
//       "address": "bhagirathpur",
//       "city": "ghatal",
//       "state": "west bengal",
//       "country": "india",
//       "pinCode": 721232,
//       "phoneNo": 9775348397
//     },
//     "orderItems": {
//       "name": "Toto",
//       "price": 700,
//       "quantity": 1,
//       "image": "https://i.dummyjson.com/data/products/20/3.jpg",
//       "product": "651c13aa239798d8ee35ad40"
//     },
//     "paymentInfo": {
//       "id": "something id",
//       "status": "paid"
//     },
//     "itemsPrice": 700,
//     "taxPrice": 7,
//     "shippingPrice": 3,
//     "totalPrice": 710,
//     "orderStatus": "Processing"
//   }