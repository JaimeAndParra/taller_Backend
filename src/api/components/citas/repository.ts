import { db } from "../../../config/database"
import { CreateError, DeleteError, GetAllError, GetError, UpdateError } from "../../../utils/customError";
import { Appointment } from "./model"

export class AppointmentRepository {

    public async getAllAppointment (): Promise<Appointment[]>{
        try {
            const allAppointment:any = await db.select('*').from('citas');
            return allAppointment
        }catch(error){
            throw new GetAllError('appointment', 'AppointmentRepository', error);
        }
    }

    public async createAppointment (appointment: Appointment): Promise<Appointment>{
        try {
            const createdAppointment:any = await db('citas').insert(appointment).returning("*");
            return createdAppointment
        }catch(error){
            throw new CreateError('appointment', 'AppointmentRepository', error);
        }

    }

    public async getAppointmentById (id: number): Promise<Appointment> {
        try {
            const appointment: Appointment = (await db('citas')).find((cita)=>cita.id_cita == id);
            return appointment
        }catch(error){
            throw new GetError('appointment', 'AppointmentRepository', error);
        }
    }

    public async getAppointmentByDoctorId (id: number): Promise<Appointment> {
        try {
            const appointment: Appointment = (await db('citas')).find((cita)=>cita.id_doctor == id);
            return appointment
        }catch(error){
            throw new GetError('appointment', 'AppointmentRepository', error);
        }
    }

    public async getAppoinmentsByPatient (id_paciente: string): Promise<Appointment[]> {
        try {
            const appointmentsPatient:any = await db.select('*').from('citas').where({id_paciente: id_paciente});
            return appointmentsPatient
        }catch(error){
            throw new GetError("appointment", "AppointmentRepository", error);
        }
    }

    public async deleteAppointmentById (id: number): Promise<void>{
        try{
            await db('citas').where({id_cita: id}).del()
        }catch(error){
            throw new DeleteError('doctor', 'DoctorRepository', error);
        }
    }
}