import Joi from "joi";
import { Especialidad } from '../../../../utils/model';

const createAppointmentSchema = Joi.object({
    identificacionPaciente: Joi.string().required(),
    especialidad: Joi.string().valid(...Object.values(Especialidad)).required(),
    id_doctor: Joi.string().required(),
    horario: Joi.string().required(),
})

const identificacionSchema = Joi.object({
    identificacion: Joi.string().required()
})

export {
    createAppointmentSchema,
    identificacionSchema,
}
