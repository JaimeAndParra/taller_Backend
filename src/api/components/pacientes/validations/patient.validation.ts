import Joi from "joi";

const createPatientSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    identificacion: Joi.string().required(),
    telefono: Joi.string(),
})

const updatePatientSchema = Joi.object({
    nombre: Joi.string(),
    apellido: Joi.string(),
    identificacion: Joi.string(),
    telefono: Joi.string(),
})

const identificacionSchema = Joi.object({
    identificacion: Joi.string().required()
})


export {
    createPatientSchema,
    identificacionSchema,
    updatePatientSchema,
}