import { DoctorError } from "../../../config/customError";
import { db } from "../../../config/database"

import { DoctorReq, Doctor } from "./model"

export class DoctorRepository {

    public async createDoctor (doctor: DoctorReq): Promise<Doctor>{
        try {
            const createdDoctor:any = await db('doctores').insert(doctor).returning("*");
            return createdDoctor
        }catch(error){
            throw new DoctorError("Error creating a new doctor", "doctorRepository", error)
        }

    }

    public async getAllDoctors (): Promise<Doctor[]>{
        try {
            const allDoctors:any = await db.select('*').from('doctores');
            return allDoctors
        }catch(error){
            throw new DoctorError("Error getting all doctors", "doctorRepository", error)
        }

    }

    public async getDoctorById (id: number): Promise<Doctor> {
        try {
            const doctor: Doctor = (await db('doctores')).find((doc)=>doc.id_doctor == id);
            return doctor
        }catch(error){
            throw new DoctorError("Error getting doctor", "doctorRepository", error);
        }
        
    }

    public async updateDoctorById (id: number, update: Partial<DoctorReq>): Promise<void>{
        try{
            await db('doctores').where({id_doctor: id}).update(update)
        }catch(error){
            throw new DoctorError("Failed to update doctor", "doctorRepository", error);
        }
    }

    public async deleteDoctorById (id: number): Promise<void>{
        try{
            await db('doctores').where({id_doctor: id}).del()
        }catch(error){
            throw new DoctorError("Failed to delete doctor", "doctorRepository", error);
        }
    }
}