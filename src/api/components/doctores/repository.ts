import { db } from "../../../config/database"
import { CreateError, DeleteError, GetAllError, GetError, UpdateError } from "../../../utils/customError";

import { DoctorReq, Doctor } from "./model"

export class DoctorRepository {

    public async getAllDoctors (): Promise<Doctor[]>{
        try {
            const allDoctors:any = await db.select('*').from('doctores');
            return allDoctors;
        }catch(error){
            throw new GetAllError('doctor', 'DoctorRepository', error);
        }
    }

    public async createDoctor (doctor: DoctorReq): Promise<Doctor>{
        try {
            const createdDoctor:any = await db('doctores').insert(doctor).returning("*");
            return createdDoctor;
        }catch(error){
            throw new CreateError('doctor', 'DoctorRepository', error);
        }
    }


    public async getDoctorById (id: number): Promise<Doctor> {
        try {
            const doctor: Doctor = (await db('doctores')).find((doc)=>doc.id_doctor == id);
            return doctor
        }catch(error){
            throw new GetError('doctor', 'DoctorRepository', error);
        }
    }

    public async updateDoctorById (id: number, update: Partial<DoctorReq>): Promise<Doctor>{
        try{
            const updatedDoctor:any = await db('doctores').where({id_doctor: id}).update(update).returning("*");
            return updatedDoctor
        }catch(error){
            throw new UpdateError('doctor', 'DoctorRepository', error);
        }
    }

    public async deleteDoctorById (id: number): Promise<void>{
        try{
            await db('doctores').where({id_doctor: id}).del()
        }catch(error){
            throw new DeleteError('doctor', 'DoctorRepository', error);
        }
    }

    public async getDoctorByIdentificacion (identificacion: string): Promise<Doctor> {
        try {
            const doctor:any = await db.select('*').from('doctores').where({identificacion: identificacion});
            return doctor
        }catch(error){
            throw new GetError("doctor", "DoctorRepository", error);
        }
    }
}