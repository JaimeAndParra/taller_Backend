import Joi from "joi";
import { Especialidad } from '../../../../utils/model'

const createDoctorSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    identificacion: Joi.string().required(),
    especialidad: Joi.string().valid(...Object.values(Especialidad)).required(),
    consultorio: Joi.number().integer().min(100).max(999).required(),
    correo: Joi.string()
})

const updateDoctorSchema = Joi.object({
    nombre: Joi.string(),
    apellido: Joi.string(),
    identificacion: Joi.string(),
    especialidad: Joi.string().valid(...Object.values(Especialidad)),
    consultorio: Joi.number().integer().min(100).max(999),
    correo: Joi.string()
})

const identificacionSchema = Joi.object({
    identificacion: Joi.string().required()
})

export { 
    createDoctorSchema,
    updateDoctorSchema,
    identificacionSchema
}