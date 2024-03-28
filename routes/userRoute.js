import express from 'express';

import {
    deleteUser,
    forgotPassword,
    getAllUser,
    getSingleUser,
    getUserDetails,
    login,
    logout,
    register,
    resetPassword,
    updatePassword,
    updateProfile,
    updateUserRole
} from '../controllers/userController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';



const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/logout',isAuthenticatedUser, logout)
router.post('/password/forgot', forgotPassword)
router.patch('/password/reset', resetPassword)
router.get('/profile', isAuthenticatedUser, getUserDetails)
router.patch('/password/update', isAuthenticatedUser, updatePassword)
router.patch('/profile/update', isAuthenticatedUser, updateProfile)
// admin
router.get('/admin/users', isAuthenticatedUser,authorizeRoles("admin"), getAllUser)
router.get('/admin/users/:id', isAuthenticatedUser,authorizeRoles("admin"), getSingleUser)
router.patch('/admin/users/:id', isAuthenticatedUser,authorizeRoles("admin"), updateUserRole)
router.delete('/admin/users/:id', isAuthenticatedUser,authorizeRoles("admin"), deleteUser)


export default router