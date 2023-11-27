import Joi from "@hapi/joi";

export default Joi.object().keys({ statusCode: Joi.number().integer(), message: Joi.string(), timestamp: Joi.string() })