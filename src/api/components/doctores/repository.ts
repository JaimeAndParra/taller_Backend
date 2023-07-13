import { db } from "../../../config/database"
import { CreateError, DeleteError, GetAllError, GetError, UpdateError } from "../../../utils/customError";

import { DoctorReq, Doctor } from "./model"

export class DoctorRepository {

    public async getAllDoctors (): Promise<Doctor[]>{
        try {
            return await db.select('*').from('doctores');
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

    public async getDoctorById (id_doctor: number): Promise<Doctor> {
        try {
            return await db('doctores').where({id_doctor}).first()
        }catch(error){
            throw new GetError('doctor', 'DoctorRepository', error);
        }
    }

    public async updateDoctorById (id_doctor: number, update: Partial<DoctorReq>): Promise<Doctor>{
        try{
            const updatedDoctor:any = await db('doctores').where({id_doctor}).update(update).returning("*");
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

    public async getDoctorByIdentificacion (identificacion: string): Promise<Doctor|any> {
        try {
            return await db.select('*').from('doctores').where({identificacion});
        }catch(error){
            throw new GetError("doctor", "DoctorRepository", error);
        }
    }
}