// validators/tradeValidator.js
const Joi = require('joi');

const tradeValidationSchema = Joi.object({
  stock_name: Joi.string().required(),
  quantity: Joi.number().integer().required(),
  broker_name: Joi.string().required(),
  price: Joi.number().positive().required(),
});

const validateTrade = (data) => {
  return tradeValidationSchema.validate(data);
};

module.exports = { validateTrade };
