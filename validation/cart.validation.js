const Joi = require("joi");
const validate = require("./validate");

const addToCartSchema = Joi.object({
  userId: Joi.string().required().trim(),
  productId: Joi.string().required().trim(),
  productName: Joi.string().min(2).max(255).required().trim(),
  productPrice: Joi.string().required().trim(),
  productDescription: Joi.string().min(3).max(150).required().trim(),
  productImg: Joi.string().required().trim(),
  productQuantity: Joi.number().required(),
});

const adminUpdateSchema = Joi.object({
  productId: Joi.string().required().trim(),
  productName: Joi.string().min(2).max(255).required().trim(),
  productPrice: Joi.string().required().trim(),
  productDescription: Joi.string().min(3).max(150).required().trim(),
  productImg: Joi.string().required().trim(),
});

const updateQuantitySchema = Joi.object({
  _id: Joi.string().required().trim(),
  productQuantity: Joi.number().required(),
});

const deleteItemFromCartSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim(),
});

const validateAddToCartSchema = (userInput) => {
  return validate(addToCartSchema, userInput);
};

const validateUpdateQuantitySchema = (userInput) => {
  return validate(updateQuantitySchema, userInput);
};

const validateDeleteItemFromCartSchema = (userInput) => {
  return validate(deleteItemFromCartSchema, userInput);
};
const validateAdminUpdateSchema = (userInput) => {
  return validate(adminUpdateSchema, userInput);
};

module.exports = {
  validateAddToCartSchema,
  validateUpdateQuantitySchema,
  validateDeleteItemFromCartSchema,
  validateAdminUpdateSchema,
};
