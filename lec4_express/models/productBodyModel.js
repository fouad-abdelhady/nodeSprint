import Joi  from "joi";

export const productSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().integer().min(1).required(),
    description: Joi.string().required(),
    categoryId: Joi.number().integer().min(1).max(24).required(),
    images: Joi.array().items(Joi.string()).required()
});

export const productUpdateSchema = Joi.object({
    title: Joi.string(),
    price: Joi.number().integer().min(1),
    description: Joi.string(),
    categoryId: Joi.number().integer().min(1).max(24),
    images: Joi.array().items(Joi.string())
});
//export default productSchema;