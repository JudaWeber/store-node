const Joi = require("joi");
const validate = require("./validate");

const newProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().trim(),
  price: Joi.string().required().trim(),
  description: Joi.string().min(3).max(150).trim(),
  img: Joi.string().uri(),
});
const updateProductSchema = Joi.object({
  _id: Joi.string().hex().label(" ID"),
  name: Joi.string().min(2).max(255).required().trim(),
  price: Joi.string().required().trim(),
  description: Joi.string().min(3).max(150).trim(),
  img: Joi.string().uri(),
});
const deleteProductSchema = Joi.object({
  id: Joi.string().length(24).hex().trim(),
});
const findProductByIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim(),
});

const validateNewProductSchema = (userInput) => {
  return validate(newProductSchema, userInput);
};
const validateUpdateProductSchema = (userInput) => {
  return validate(updateProductSchema, userInput);
};
const validateDeleteProductSchema = (userInput) => {
  return validate(deleteProductSchema, userInput);
};
const validateFindByIdProductSchema = (userInput) => {
  return validate(findProductByIdSchema, userInput);
};

module.exports = {
  validateNewProductSchema,
  validateUpdateProductSchema,
  validateDeleteProductSchema,
  validateFindByIdProductSchema,
};
