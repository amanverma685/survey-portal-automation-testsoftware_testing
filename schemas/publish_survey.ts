import Joi from "@hapi/joi";

const publishSurveyResponseSchema = Joi.object().keys({ data: Joi.array(), success: Joi.boolean(), message: Joi.string(), status: Joi.number().integer() })

export default publishSurveyResponseSchema;