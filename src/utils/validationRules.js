import Joi from "joi";

/* 
Valideringsregler for inputda.
*/

const validationRules = {
  signUp: Joi.object({
    username: Joi.string().min(3).max(30).required().pattern(new RegExp("^[a-zA-Z0-9]+$")),
    password: Joi.string().min(3).required(),
    role: Joi.string().valid("employee", "admin").required()
  }),
  signIn: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
  products: Joi.object({
    name: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9 ]+$")),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required()
  }),
  orders: Joi.object({
    customerName: Joi.string().required(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().required(),
          quantity: Joi.number().positive().integer().required()
        })
      )
      .min(1)
      .required()
  }),
  updateStatus: Joi.object({
    status: Joi.string().valid("pending", "completed").required()
  })
};

export default validationRules;
