import express from 'express';
import validate from '../utils/validators.js';
import * as categorySchemas from '../models/categoryBodyModel.js';
import * as categoryController from '../controllers/categoryController.js';
import * as authController from '../controllers/authController.js';
import actions  from '../utils/actions.js';
const  router = express.Router();
router.get(
    '/categories/:id([0-9]*)?', 
    authController.verifyUser(actions.getCategory),
    categoryController.getCategory);
router.post(
    '/categories', [
        authController.verifyUser(actions.addCategory), 
        validate(categorySchemas.categorySchema)], 
        categoryController.createCategory);
router.put(
    '/categories/:id([0-9]*)', [
        authController.verifyUser(actions.updateCategory), 
        validate(categorySchemas.categoryUpdateSchema)] ,
        categoryController.updateCategory);
router.delete(
    '/categories/:id([0-9]*)', 
    authController.verifyUser(actions.deleteCatecory), 
    categoryController.deleteCategory);
    
export default router;