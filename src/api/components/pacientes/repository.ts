import { PatientError } from "../../../config/customError";
import { db } from "../../../config/database"
import { Patient, PatientReq } from "./model"

export class PatientRepository {

    public async createPatient (patient: PatientReq): Promise<Patient>{
        try {
            const createdPatient:any = await db('pacientes').insert(patient).returning("*");
            return createdPatient
        }catch(error){
            throw new PatientError("Error creating a new patient", "patientRepository", error)
        }

    }

    public async getAllPatients (): Promise<Patient[]>{
        try {
            const allPatients:any = await db.select('*').from('pacientes');
            return allPatients
        }catch(error){
            throw new PatientError("Error getting all patients", "patientRepository", error)
        }

    }

    public async getPatientById (id: number): Promise<Patient> {
        try {
            const patient: Patient = (await db('pacientes')).find((patient)=>patient.id_paciente == id);
            return patient
        }catch(error){
            throw new PatientError("Error getting patient", "patientRepository", error);
        }  
    }

    public async getPatientByCedula (identificacion: string): Promise<Patient> {
        try {
            const patient: Patient = (await db('pacientes')).find((patient)=>patient.identificacion == identificacion);
            return patient
        }catch(error){
            throw new PatientError("Error getting patient", "patientRepository", error);
        }
    }

    public async updatePatientById (id: number, update: Partial<Patient>): Promise<void>{
        try{
            await db('pacientes').where({id_paciente: id}).update(update)
        }catch(error){
            throw new PatientError("Failed to update patient", "PatientRepository", error);
        }
    }

    public async deletePatientById (id: number): Promise<void>{
        try{
            await db('pacientes').where({id_paciente: id}).del()
        }catch(error){
            throw new PatientError("Failed to delete patient", "PatientRepository", error);
        }
    }
}