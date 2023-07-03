/* El servicio es quien se encarga de ejecutar el modelo */
/* La interface se encarga de indicarle al controlador el uso del servicio */

import { RecordNotFoundError, DoctorError, MustBeANumber } from '../../../config/customError';
import {Doctor, DoctorReq} from './model'
import { DoctorRepository } from './repository';

export interface DoctorService {
    getAllDoctors(): Promise<Doctor[]>,
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>,
    getDoctorById(idReq: string): Promise<Doctor>,
    updateDoctorById(idReq: string, update: Partial<DoctorReq>): Promise<Doctor>
    deleteDoctorById(idReq: string): Promise<Doctor>,
}

export class DoctorServiceImpl implements DoctorService {

    private doctorRepository: DoctorRepository;

    constructor(doctorRepository: DoctorRepository){
        this.doctorRepository = doctorRepository;
    }

    public getAllDoctors(): Promise<Doctor[]> {
        try{
            return this.doctorRepository.getAllDoctors();
        }catch(error){
            throw new DoctorError("Error getting all doctors", "doctorService", error)
        }
    }

    public createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        
        try{   
            const doctor: Doctor = {
                nombre: doctorReq.nombre,
                apellido: doctorReq.apellido,
                especialidad: doctorReq.especialidad,
                consultorio: doctorReq.consultorio,
                correo: doctorReq.correo,
                created_at: new Date(),
                updated_at: new Date()
            }
            return this.doctorRepository.createDoctor(doctor);
        }catch(error){
            throw new DoctorError("Error creating a new doctor", "doctorService", error)
        }   
    }

    public async getDoctorById(idReq: string): Promise <Doctor>{
        try{
            const id = parseInt(idReq);
            if(isNaN(id)){
                throw new MustBeANumber();
            }
            const existDoctor = await this.doctorRepository.getDoctorById(id);
            if (!existDoctor){
                throw new RecordNotFoundError();
            }
            return existDoctor
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else if(error instanceof MustBeANumber){
                throw error;
            }else{
                throw new DoctorError("Error getting doctor", "doctorService", error)
            }
        }
    }

    public async updateDoctorById(idReq: string, update: Partial<DoctorReq>): Promise<Doctor>{
        try{
            const id = parseInt(idReq);
            if(isNaN(id)){
                throw new MustBeANumber();
            }
            const existDoctor = await this.doctorRepository.getDoctorById(id);
            if (!existDoctor){
                throw new RecordNotFoundError();
            }
            const updateDoctor = {...existDoctor, ...update};
            this.doctorRepository.updateDoctorById(id, updateDoctor);
            return updateDoctor;
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else if(error instanceof MustBeANumber){
                throw error;
            }else{
                throw new DoctorError("Failed to update doctor", "doctorService", error)
            }
        }
    }

    public async deleteDoctorById(idReq: string): Promise<Doctor>{
        try{
            const id = parseInt(idReq);
            if(isNaN(id)){
                throw new MustBeANumber();
            }
            const existDoctor = await this.doctorRepository.getDoctorById(id);
            if (!existDoctor){
                throw new RecordNotFoundError();
            }
            this.doctorRepository.deleteDoctorById(id);
            return existDoctor
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else if(error instanceof MustBeANumber){
                throw error;
            }else{
                throw new DoctorError("Failed to delete doctor", "doctorService", error)
            }
        }
    }
}