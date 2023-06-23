import express from 'express';
import validate from '../utils/validators.js';
import * as productSchemas from '../models/productBodyModel.js'
import * as productController from '../controllers/productsController.js'
const  router = express.Router();

router.get('/products/:id([0-9]*)?', productController.getProducts);
router.post('/products', validate(productSchemas.productSchema), productController.createProduct);
router.put('/products/:id([0-9]*)', validate(productSchemas.productUpdateSchema) ,productController.updateProduct);
router.delete('/products/:id([0-9]*)', productController.deleteProduct)
export default router;