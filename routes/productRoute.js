import express from 'express';
import {
    getAllProduct,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getAdminProducts,
    createProductReview,
    getProductReviews,
    deleteReview
} from "../controllers/productController.js";
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();



// all user can access
router.get('/', getAllProduct)

// admin only access
router.post('/admin/new', isAuthenticatedUser, authorizeRoles("admin"), createProduct)
router.get('/admin/all', isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts)

// all user can access
router.get("/:id", getProduct)

// reviews
router.put("/review",isAuthenticatedUser, createProductReview)
router.get("/review/one", getProductReviews)  // any user can see review
router.delete("/review",isAuthenticatedUser, deleteReview)


// admin only access
router.patch("/admin/:id", isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
router.delete("/admin/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)

export default router
