import express from 'express';
import * as productController from '../controllers/productsController.js'
const  router = express.Router();

router.get('/products/:id([0-9]*)?', productController.getProducts);
router.post('/products', productController.validateCreateProductBody, productController.createProduct);
router.put('/products/:id([0-9]*)', productController.validateUpdateProductBody ,productController.updateProduct);
router.delete('/products/:id([0-9]*)', productController.deleteProduct)
export default router;