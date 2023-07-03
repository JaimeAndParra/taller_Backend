import { AppointmentError } from "../../../config/customError";
import { db } from "../../../config/database"
import { Appointment, AppointmentReq } from "./model"

export class AppointmentRepository {

    public async createAppointment (appointment: Appointment): Promise<Appointment>{
        try {
            const createdAppointment:any = await db('citas').insert(appointment).returning("*");
            return createdAppointment
        }catch(error){
            throw new AppointmentError("Error creating a new patient", "AppointmentRepository", error)
        }

    }

    public async getAllAppointment (): Promise<Appointment[]>{
        try {
            const allAppointment:any = await db.select('*').from('citas');
            return allAppointment
        }catch(error){
            throw new AppointmentError("Error getting all appointment", "AppointmentRepository", error)
        }

    }

    public async getAppointmentById (id: number): Promise<Appointment> {
        try {
            const appointment: Appointment = (await db('citas')).find((cita)=>cita.id_cita == id);
            return appointment
        }catch(error){
            throw new AppointmentError("Error getting appointment", "AppointmentRepository", error);
        }
    }

    public async updateAppointmentById (id: number, update: Partial<Appointment>): Promise<void>{
        try{
            await db('citas').where({id_cita: id}).update(update)
        }catch(error){
            throw new AppointmentError("Failed to update appointment", "AppointmentRepository", error);
        }
    }

    public async deleteAppointmentById (id: number): Promise<void>{
        try{
            await db('citas').where({id_cita: id}).del()
        }catch(error){
            throw new AppointmentError("Failed to delete appointment", "AppointmentRepository", error);
        }
    }
}