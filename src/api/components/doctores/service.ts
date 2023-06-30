/* El servicio es quien se encarga de ejecutar el modelo */
/* La interface se encarga de indicarle al controlador el uso del servicio */

import {Doctor, DoctorReq} from './model'
import { DoctorRepository } from './repository';

export interface DoctorService {
    getAllDoctors(): Promise<Doctor[]>,
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>,
}

export class DoctorServiceImpl implements DoctorService {

    private doctorRepository: DoctorRepository;

    constructor(doctorRepository: DoctorRepository){
        this.doctorRepository = doctorRepository;
    }

    public getAllDoctors(): Promise<Doctor[]> {
        return this.doctorRepository.getAllDoctors();
    }

    public createDoctor(doctorReq: DoctorReq): Promise<Doctor> {    
         
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
    }
}