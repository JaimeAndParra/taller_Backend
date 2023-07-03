import { RecordNotFoundError, PatientError, MustBeANumber } from '../../../config/customError';
import { Patient, PatientReq} from './model'
import { PatientRepository } from './repository';

export interface PatientService {
    getAllPatients(): Promise<Patient[]>,
    createPatient(patientReq: PatientReq): Promise<Patient>,
    getPatientById(idReq: string): Promise<Patient>,
    getPatientByCedula(cedulaReq: string): Promise<Patient>,
    updatePatientById(idReq: string, update: Partial<PatientReq>): Promise<Patient>
    deletePatientById(idReq: string): Promise<Patient>,
}

export class PatientServiceImpl implements PatientService {

    private patientRepository: PatientRepository;

    constructor(patientRepository: PatientRepository){
        this.patientRepository = patientRepository;
    }

    public getAllPatients(): Promise<Patient[]> {
        try{
            return this.patientRepository.getAllPatients();
        }catch(error){
            throw new PatientError("Error getting all patients", "patientService", error)
        }
    }

    public createPatient(patientReq: PatientReq): Promise<Patient> {
        
        try{   
            const patient: Patient = {
                nombre: patientReq.nombre,
                apellido: patientReq.apellido,
                identificacion: patientReq.identificacion,
                telefono: patientReq.telefono,
                created_at: new Date(),
                updated_at: new Date()
            }
            return this.patientRepository.createPatient(patient);
        }catch(error){
            throw new PatientError("Error creating a new patient", "patientService", error)
        }   
    }

    public async getPatientById(idReq: string): Promise <Patient>{
        try{
            const id = parseInt(idReq);
            if(isNaN(id)){
                throw new MustBeANumber();
            }
            const existPatient = await this.patientRepository.getPatientById(id);
            if (!existPatient){
                throw new RecordNotFoundError();
            }
            return existPatient
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else if(error instanceof MustBeANumber){
                throw error;
            }else{
                throw new PatientError("Error getting patient", "PatientService", error)
            }
        }
    }

    public async getPatientByCedula(identificacion: string): Promise <Patient>{
        try{
            if (typeof identificacion == 'undefined'){
                throw new RecordNotFoundError();
            }
            const existPatient = await this.patientRepository.getPatientByCedula(identificacion);
            if (!existPatient){
                throw new RecordNotFoundError();
            }
            return existPatient
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else{
                throw new PatientError("Error getting patient", "PatientService", error)
            }
        }
    }

    public async updatePatientById(idReq: string, update: Partial<PatientReq>): Promise<Patient>{
        try{
            const id = parseInt(idReq);
            if(isNaN(id)){
                throw new MustBeANumber();
            }
            const existPatient = await this.patientRepository.getPatientById(id);
            if (!existPatient){
                throw new RecordNotFoundError();
            }
            const updatePatient = {...existPatient, ...update};
            this.patientRepository.updatePatientById(id, updatePatient);
            return updatePatient;
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else if(error instanceof MustBeANumber){
                throw error;
            }else{
                throw new PatientError("Failed to update patient", "patientService", error)
            }
        }
    }

        public async deletePatientById(idReq: string): Promise<Patient>{
        try{
            const id = parseInt(idReq);
            if(isNaN(id)){
                throw new MustBeANumber();
            }
            const existPatient = await this.patientRepository.getPatientById(id);
            if (!existPatient){
                throw new RecordNotFoundError();
            }
            this.patientRepository.deletePatientById(id);
            return existPatient
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else if(error instanceof MustBeANumber){
                throw error;
            }else{
                throw new PatientError("Failed to delete patient", "PatientService", error) 
            }
        }
    }
}