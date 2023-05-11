const Joi = require("joi");
const validate = require("./validate");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().trim(),
  email: Joi.string().min(8).max(255).email().required().trim(),
  phone: Joi.string()
    .required()
    .regex(new RegExp("^(?:\\+?\\d{1,3}|0)?-?\\d{2,3}-?\\d{6,7}$")),
  password: Joi.string()
    .regex(new RegExp("^(?=.*\\d{4,})(?=.*[*\\-_&^%$#@!])(?=.*[a-zA-Z]).{8,}$"))
    .required(),
  isAdmin: Joi.boolean(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(8).max(255).email().required().trim(),
  password: Joi.string()
    .regex(new RegExp("^(?=.*\\d{4,})(?=.*[*\\-_&^%$#@!])(?=.*[a-zA-Z]).{8,}$"))
    .required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().min(8).max(255).email().required().trim(),
});

const updateUserSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim(),
  name: Joi.string().min(3).max(255).trim(),
  email: Joi.string().min(8).max(255).email().trim(),
  phone: Joi.string()
    .required()
    .regex(new RegExp("^(?:\\+?\\d{1,3}|0)?-?\\d{2,3}-?\\d{6,7}$")),
  isAdmin: Joi.boolean(),
});

const deleteUserSchema = Joi.object({
  id: Joi.string().length(24).hex().trim(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .regex(new RegExp("^(?=.*\\d{4,})(?=.*[*\\-_&^%$#@!])(?=.*[a-zA-Z]).{8,}$"))
    .required(),
});

const validateRegisterSchema = (userInput) => {
  return validate(registerSchema, userInput);
};
const validateLoginSchema = (userInput) => {
  return validate(loginSchema, userInput);
};

const validateForgotPasswordSchema = (userInput) => {
  return validate(forgotPasswordSchema, userInput);
};

const validateUpdateUserSchema = (userInput) => {
  return validate(updateUserSchema, userInput);
};

const validateDeleteUserSchema = (userInput) => {
  return validate(deleteUserSchema, userInput);
};

const validateResetPasswordSchema = (userInput) => {
  return validate(resetPasswordSchema, userInput);
};

module.exports = {
  validateRegisterSchema,
  validateLoginSchema,
  validateForgotPasswordSchema,
  validateUpdateUserSchema,
  validateDeleteUserSchema,
  validateResetPasswordSchema,
};
