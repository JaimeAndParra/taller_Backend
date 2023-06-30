import { db } from "../../../config/database"

import { DoctorReq, Doctor } from "./model"

export class DoctorRepository {

    public async createDoctor (doctor: DoctorReq): Promise<Doctor>{
        try {
            const createdDoctor:any = await db('doctores').insert(doctor).returning("*");
            return createdDoctor
        }catch(error){
            throw new Error(`Error creating doctor: [${error}]`)
        }

    }

    public async getAllDoctors (): Promise<Doctor[]>{
        try {
            const allDoctors:any = await db.select('*').from('doctores');
            return allDoctors
        }catch(error){
            throw new Error(`Error getting all doctors: [${error}]`)
        }

    }
}