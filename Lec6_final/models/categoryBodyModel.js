import Joi  from "joi";

const urlPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
export const categorySchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().regex(urlPattern).required()
});

export const categoryUpdateSchema = Joi.object({
    name: Joi.string(),
    image: Joi.string().regex(urlPattern)
});