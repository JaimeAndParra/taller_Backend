import { CreateError, CustomError, DeleteError, GetAllError, GetError, RecordAlreadyExistsError, RecordNotFoundError, UpdateError } from '../../../utils/customError';
import { AppointmentRepository } from '../citas/repository';
import {Doctor, DoctorDBInsert, DoctorReq} from './model'
import { DoctorRepository } from './repository';

export interface DoctorService {
    getAllDoctors(): Promise<Doctor[]>,
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>,
    getDoctorById(idReq: number): Promise<Doctor>,
    getDoctorByIdentificacion(identificacion: string): Promise<Doctor[]>,
    updateDoctorById(existDoctor: Doctor, update: Partial<DoctorReq>): Promise<Doctor>,
    deleteDoctorById(doctor: Doctor): Promise<Doctor>
}

export class DoctorServiceImpl implements DoctorService {

    private doctorRepository: DoctorRepository;
    private appointmentRepository: AppointmentRepository;

    constructor(doctorRepository: DoctorRepository){
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = new AppointmentRepository;
    }

    public async getAllDoctors(): Promise<Doctor[]> {
        try{
            return await this.doctorRepository.getAllDoctors();
        }catch(error){
            if (error instanceof GetAllError) throw error;
            throw new GetAllError('doctor', 'DoctorService', error);
        }
    }

    public async createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        try{
            const identificacion = doctorReq.identificacion;
            const doctorExist:any = await this.doctorRepository.getDoctorByIdentificacion(identificacion);
            if(doctorExist.length){       
                
                const nombreDoctorExist = doctorExist.map(function(doc:any){ return `${doc.nombre} ${doc.apellido}`});
                const nombreDoctorReq = `${doctorReq.nombre} ${doctorReq.apellido}`
                if (!nombreDoctorReq.includes(nombreDoctorExist)) throw new RecordAlreadyExistsError("Doctor");
                
                const especialidades = doctorExist.map(function(d:any){ return d.especialidad});
                if (especialidades.includes(doctorReq.especialidad)) throw new RecordAlreadyExistsError("Doctor");
            }

            const doctorCreate: DoctorDBInsert = {...doctorReq};
            doctorCreate.created_at = doctorCreate.updated_at = new Date();
            return this.doctorRepository.createDoctor(doctorCreate);
        }catch(error){
            if(error instanceof RecordAlreadyExistsError) throw error;
            if(error instanceof CreateError) throw error;
            throw new CreateError('doctor', 'DoctorService', error);
        }   
    }

    public async getDoctorById(id: number): Promise <Doctor>{
        try{
            const existDoctor = await this.doctorRepository.getDoctorById(id);
            if (!existDoctor) throw new RecordNotFoundError('Doctor');
            return existDoctor;
        }catch(error){
            if (error instanceof RecordNotFoundError) throw error;
            if (error instanceof GetError) throw error;
            throw new GetError('doctor', 'DoctorService', error);
        }
    }

    public async getDoctorByIdentificacion(identificacion: string): Promise <Doctor[]>{
        try{
            const doctor:any = await this.doctorRepository.getDoctorByIdentificacion(identificacion);
            if (!doctor.length) throw new RecordNotFoundError('Doctor');
            return doctor;
        }catch(error){
            if(error instanceof RecordNotFoundError) throw error;
            if(error instanceof GetError) throw error;
            throw new GetError('doctor', 'DoctorService', error);
        }
    }

    public async updateDoctorById(existDoctor: Doctor, update: Partial<DoctorReq>): Promise<Doctor>{
        try{
            const updateDoctor = {...existDoctor, ...update};
            updateDoctor.updated_at = new Date();
            return await this.doctorRepository.updateDoctorById(existDoctor.id_doctor, updateDoctor);
        }catch(error){
            if(error instanceof UpdateError) throw error;
            throw new UpdateError('doctor', 'DoctorService', error)
        }
    }

    public async deleteDoctorById(doctor: Doctor): Promise<Doctor>{
        try{
            const id_doctor = doctor.id_doctor;
            const appointment:any = await this.appointmentRepository.getAppointmentByDoctorId(id_doctor);
            if(appointment){
                throw new CustomError(`Doctor ${doctor.apellido} has registered appointments. Are you sure you want to delete it?`)
            }
            this.doctorRepository.deleteDoctorById(id_doctor);
            return doctor
        }catch(error){
            if(error instanceof CustomError) throw error;
            if(error instanceof DeleteError) throw error;
            throw new DeleteError('doctor', 'DoctorService', error)
        }
    }
}