import { CreateError, CustomError, DeleteError, GetAllError, GetError, RecordAlreadyExistsError, RecordNotFoundError, UpdateError } from '../../../utils/customError';
import { AppointmentRepository } from '../citas/repository';
import {Doctor, DoctorReq} from './model'
import { DoctorRepository } from './repository';

export interface DoctorService {
    getAllDoctors(): Promise<Doctor[]>,
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>,
    getDoctorById(idReq: number): Promise<Doctor>,
    getDoctorByIdentificacion(identificacion: string): Promise<Doctor[]>,
    updateDoctorById(idReq: number, update: Partial<DoctorReq>): Promise<Doctor>
    deleteDoctorById(idReq: number): Promise<Doctor>,
}

export class DoctorServiceImpl implements DoctorService {

    private doctorRepository: DoctorRepository;
    private appointmentRepository: AppointmentRepository;

    constructor(doctorRepository: DoctorRepository){
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = new AppointmentRepository;
    }

    public getAllDoctors(): Promise<Doctor[]> {
        try{
            return this.doctorRepository.getAllDoctors();
        }catch(error){
            throw new GetAllError('doctor', 'DoctorService', error);
        }
    }

    public async createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        try{
            const identificacion = doctorReq.identificacion;
            const doctorExist:any = await this.doctorRepository.getDoctorByIdentificacion(identificacion);
            if(doctorExist.length){       
                const nombreDoctor = doctorExist.map(function(d:any){ return `${d.nombre} ${d.apellido}`});
                const nombreDoctorReq = `${doctorReq.nombre} ${doctorReq.apellido}`
                if (!nombreDoctorReq.includes(nombreDoctor)){
                    throw new RecordAlreadyExistsError("Doctor");
                }
                const especialidades = doctorExist.map(function(d:any){ return d.especialidad});
                if (especialidades.includes(doctorReq.especialidad)){
                    throw new RecordAlreadyExistsError("Doctor");
                }
            }
            const doctorCreate: Doctor = {...doctorReq};
            doctorCreate.created_at = doctorCreate.updated_at = new Date();
            return this.doctorRepository.createDoctor(doctorCreate);
        }catch(error){
            if(error instanceof RecordAlreadyExistsError){
                throw error;
            }else{ 
                throw new CreateError('doctor', 'DoctorService', error);
            }
        }   
    }

    public async getDoctorById(id: number): Promise <Doctor>{
        try{
            const existDoctor = await this.doctorRepository.getDoctorById(id);
            if (!existDoctor){
                throw new RecordNotFoundError('Doctor');
            }
            return existDoctor;
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else{
                throw new GetError('doctor', 'DoctorService', error);
            }
        }
    }

    public async getDoctorByIdentificacion(identificacion: string): Promise <Doctor[]>{
        try{
            const doctor:any = await this.doctorRepository.getDoctorByIdentificacion(identificacion);
            if (!doctor.length){
                throw new RecordNotFoundError('Doctor');
            }
            return doctor;
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else{
                throw new GetError('doctor', 'DoctorService', error);
            }
        }
    }

    public async updateDoctorById(id: number, update: Partial<DoctorReq>): Promise<Doctor>{
        try{
            const existDoctor = await this.doctorRepository.getDoctorById(id);
            if (!existDoctor){
                throw new RecordNotFoundError('Doctor');
            }
            const updateDoctor = {...existDoctor, ...update};
            updateDoctor.updated_at = new Date();
            return await this.doctorRepository.updateDoctorById(id, updateDoctor);
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else{
                throw new UpdateError('doctor', 'DoctorService', error)
            }
        }
    }

    public async deleteDoctorById(id: number): Promise<Doctor>{
        try{
            const existDoctor = await this.doctorRepository.getDoctorById(id);
            if (!existDoctor){
                throw new RecordNotFoundError('Doctor');
            }
            const appointment:any = await this.appointmentRepository.getAppointmentByDoctorId(id);
            if(appointment){
                throw new CustomError(`Doctor ${existDoctor.apellido} has registered appointments. Are you sure you want to delete it?`)
            }
            this.doctorRepository.deleteDoctorById(id);
            return existDoctor
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else if(error instanceof CustomError){
                throw error;
            }else{
                throw new DeleteError('doctor', 'DoctorService', error)
            }
        }
    }
}