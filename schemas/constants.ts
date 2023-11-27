import Joi from '@hapi/joi';

let constants = Joi.object().keys({
    id: Joi.string().required(),
    constantType: Joi.string().required(),
    constantValue: Joi.string().required(),
    parentId: Joi.string().allow(null),
    maxCredits: Joi.number().allow(null),
    enabled: Joi.boolean().required(),
    parent: Joi.object().allow(null)
})

const getConstantresponseSchema = Joi.object({
    data: Joi.array().items(
        constants
    ),
    success: Joi.boolean().required(),
    message: Joi.string().required(),
    status: Joi.number().required()
});

export default getConstantresponseSchema;