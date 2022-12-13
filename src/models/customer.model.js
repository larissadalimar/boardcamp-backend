import joi from 'joi';

const customerSchema = joi.object({
    cpf: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    name: joi.string().required().min(1),
    birthday: joi.date().less('12-12-2022').required()
});

export default customerSchema;