import express from 'express';

import { register } from '../controllers/userController.js';

const router = express.Router();

// router.get('/',getAllProduct )
router.post('/',register )
// router.get("/:id", getProduct)
// router.patch("/:id", updateProduct)
// router.delete("/:id", deleteProduct)

export default router