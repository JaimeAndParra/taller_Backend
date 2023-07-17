import { RecordNotFoundError, CreateError, GetAllError, GetError, DeleteError } from '../../../utils/customError';
import { Appointment, AppointmentDBInsert, AppointmentReq, AppointmentRes} from './model'
import { AppointmentRepository } from './repository';
import { Patient } from '../pacientes/model';
import { Doctor } from '../doctores/model';

export interface AppointmentService {
    getAllAppointment(): Promise<Appointment[]>,
    createAppointment(patient: Patient, doctor: Doctor, appointmentReq: AppointmentReq): Promise<AppointmentRes>
    getAppointmentById(id: number): Promise <Appointment>
    getAppointmentsByPatient(id_paciente: number): Promise <Appointment[]>
    deleteAppointmentById(id: number): Promise<Appointment>
}

export class AppointmentServiceImpl implements AppointmentService {

    private appointmentRepository: AppointmentRepository;

    constructor(appointmentRepository: AppointmentRepository){
        this.appointmentRepository = appointmentRepository;
    }

    public getAllAppointment(): Promise<Appointment[]> {
        try{
            return this.appointmentRepository.getAllAppointment();
        }catch(error){
            if (error instanceof GetAllError) throw error;
            throw new GetAllError('appointment', 'AppointmentService', error);
        }
    }

    public async createAppointment(patient: Patient, doctor: Doctor, appointmentReq: AppointmentReq): Promise<AppointmentRes> {
        try{
            const appointment: AppointmentDBInsert = {
                id_doctor: doctor.id_doctor,
                id_paciente: patient.id_paciente,
                horario: appointmentReq.horario,
                created_at: new Date(), 
                updated_at: new Date(), 
            }
            await this.appointmentRepository.createAppointment(appointment);
            const appointmentRes: AppointmentRes = {
                identificacionPaciente: appointmentReq.identificacionPaciente,
                doctor: `${doctor.nombre} ${doctor.apellido}`,
                especialidad: doctor.especialidad,
                horario: appointmentReq.horario,
                consultorio: doctor.consultorio,
            }
            return appointmentRes
        }catch(error){
            if (error instanceof CreateError) throw error;
            throw new CreateError('appointment', 'AppointmentService', error);
        }   
    }

    public async getAppointmentById(id: number): Promise <Appointment>{
        try{            
            const existAppointment = await this.appointmentRepository.getAppointmentById(id);
            if (!existAppointment) throw new RecordNotFoundError("Appointment");
            return existAppointment
        }catch(error){
            if (error instanceof RecordNotFoundError) throw error;
            if (error instanceof GetError) throw error;
            throw new GetError('appointment', 'AppointmentService', error);
        }
    }

    public async getAppointmentsByPatient(id_paciente: number): Promise <Appointment[]>{
        try{
            const appointmentsPatient:any = await this.appointmentRepository.getAppoinmentsByPatient(id_paciente);
            if (!appointmentsPatient.length) throw new RecordNotFoundError("Appointments");            
            return appointmentsPatient
        }catch(error){
            if (error instanceof RecordNotFoundError) throw error;
            if (error instanceof GetError) throw error;
            throw new GetError('appointment', 'AppointmentService', error);
        }
    }

    public async deleteAppointmentById(id: number): Promise<Appointment>{
        try{
            return await this.appointmentRepository.deleteAppointmentById(id);
        }catch(error){
            if (error instanceof DeleteError) throw error;
            throw new DeleteError('appointment', 'AppointmentService', error) 
        }
    }
}