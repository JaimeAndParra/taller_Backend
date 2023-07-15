import { CreateError, DeleteError, GetAllError, GetError, RecordAlreadyExistsError, RecordNotFoundError, UpdateError } from '../../../utils/customError';
import { Patient, PatientDBInsert, PatientReq} from './model'
import { PatientRepository } from './repository';

export interface PatientService {
    getAllPatients(): Promise<Patient[]>,
    createPatient(patientReq: PatientReq): Promise<Patient>,
    getPatientById(id: number): Promise<Patient>,
    getPatientByIdentificacion(identificacion: string): Promise<Patient>,
    updatePatientById(existPatient: Patient, update: Partial<PatientReq>): Promise<Patient>,
    deletePatientById(patient: Patient): Promise<Patient>
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
            if (error instanceof GetAllError) throw error;
            throw new GetAllError('patient', 'PatientService', error);
        }
    }

    public async createPatient(patientReq: PatientReq): Promise<Patient> {
        try{   
            const identificacion = patientReq.identificacion;
            const patientExist:any = await this.patientRepository.getPatientByIdentificacion(identificacion);            
            if(patientExist!==undefined) throw new RecordAlreadyExistsError("Patient");
            const patientCreate: PatientDBInsert = {...patientReq};
            patientCreate.created_at = patientCreate.updated_at = new Date();
            return this.patientRepository.createPatient(patientCreate);
        }catch(error){
            if(error instanceof RecordAlreadyExistsError) throw error;
            if(error instanceof CreateError) throw error;
            throw new CreateError('patient', 'PatientService', error);
        }   
    }

    public async getPatientById(id: number): Promise <Patient>{
        try{
            const existPatient = await this.patientRepository.getPatientById(id);
            if (!existPatient) throw new RecordNotFoundError('Patient');
            return existPatient
        }catch(error){
            if (error instanceof RecordNotFoundError) throw error;
            if (error instanceof GetError) throw error;
            throw new GetError('patient', 'PatientService', error);
        }
    }

    public async getPatientByIdentificacion(identificacion: string): Promise <Patient>{
        try{
            const patient:any = await this.patientRepository.getPatientByIdentificacion(identificacion);
            if (!patient) throw new RecordNotFoundError('Patient');
            return patient
        }catch(error){
            if(error instanceof RecordNotFoundError) throw error;
            if(error instanceof GetError) throw error;
            throw new GetError('patient', 'PatientService', error);
        }
    }

    public async updatePatientById(existPatient: Patient, update: Partial<PatientReq>): Promise<Patient>{
        try{
            const updatePatient = {...existPatient, ...update};
            updatePatient.updated_at = new Date();
            return await this.patientRepository.updatePatientById(existPatient.id_paciente, updatePatient);
        }catch(error){
            if(error instanceof UpdateError) throw error;
            throw new UpdateError('patient', 'PatientService', error)
        }
    }

    public async deletePatientById(patient: Patient): Promise<Patient>{
        try{
            this.patientRepository.deletePatientById(patient.id_paciente);
            return patient
        }catch(error){
            if(error instanceof DeleteError) throw error;
            throw new DeleteError('patient', 'PatientService', error)
        }
    }
}