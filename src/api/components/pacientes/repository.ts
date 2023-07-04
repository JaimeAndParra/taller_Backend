import { db } from "../../../config/database"
import { CreateError, DeleteError, GetAllError, GetError, UpdateError } from "../../../utils/customError";
import { Patient, PatientReq } from "./model"

export class PatientRepository {

    public async getAllPatients (): Promise<Patient[]>{
        try {
            const allPatients:any = await db.select('*').from('pacientes');
            return allPatients
        }catch(error){
            throw new GetAllError('patient', 'PatientRepository', error);
        }
    }

    public async createPatient (patient: PatientReq): Promise<Patient>{
        try {
            const createdPatient:any = await db('pacientes').insert(patient).returning("*");
            return createdPatient
        }catch(error){
            throw new CreateError('patient', 'PatientRepository', error);            
        }

    }

    public async getPatientById (id: number): Promise<Patient> {
        try {
            const patient: Patient = (await db('pacientes')).find((patient)=>patient.id_paciente == id);
            return patient
        }catch(error){
            throw new GetError('patient', 'PatientRepository', error);
        }  
    }

    public async getPatientByIdentificacion (identificacion: string): Promise<Patient> {
        try {
            const patient:any = await db.select('*').from('pacientes').where({identificacion: identificacion});
            return patient
        }catch(error){
            throw new GetError("patient", "PatientRepository", error);
        }
    }

    public async updatePatientById (id: number, update: Partial<Patient>): Promise<Patient>{
        try{
            const updatedPatient:any = await db('pacientes').where({id_paciente: id}).update(update).returning("*");
            return updatedPatient
        }catch(error){
            throw new UpdateError('patient', 'patientRepository', error);
        }
    }

    public async deletePatientById (id: number): Promise<void>{
        try{
            await db('pacientes').where({id_paciente: id}).del()
        }catch(error){
            throw new DeleteError('patient', 'PatientRepository', error);
        }
    }
}