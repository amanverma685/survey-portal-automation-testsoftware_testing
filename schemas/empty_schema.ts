import Joi from "@hapi/joi";

export default Joi.object().keys({ data: Joi.array(), success: Joi.boolean(), message: Joi.string(), status: Joi.number().integer() })