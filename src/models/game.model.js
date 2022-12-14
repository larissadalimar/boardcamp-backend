import joi from 'joi';

const gameSchema = joi.object({
    name: joi.string().min(1).required(),
    image:joi.string().uri(), 
    stockTotal: joi.number().integer().min(0).required(), 
    categoryId: joi.number().integer().required(), 
    pricePerDay: joi.number().integer().required()
});

export default gameSchema;