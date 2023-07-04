import { RecordNotFoundError, CustomError, CreateError, GetAllError, GetError, DeleteError } from '../../../utils/customError';
import { DoctorRepository } from '../doctores/repository';
import { PatientRepository } from '../pacientes/repository';
import { DoctorService, DoctorServiceImpl } from '../doctores/service';
import { PatientService, PatientServiceImpl } from '../pacientes/service';
import { Appointment, AppointmentReq, AppointmentRes} from './model'
import { AppointmentRepository } from './repository';

export interface AppointmentService {
    getAllAppointment(): Promise<Appointment[]>,
    createAppointment(appointmentReq: AppointmentReq): Promise<AppointmentRes>,
    getAppointmentById(id: number): Promise<AppointmentRes>,
    getAppointmentsByPatient(identificacion: string): Promise <Appointment[]>,
    deleteAppointmentById(id: number): Promise<Appointment>
}

export class AppointmentServiceImpl implements AppointmentService {

    private appointmentRepository: AppointmentRepository;
    private doctorService: DoctorService;
    private patientService: PatientService;

    constructor(appointmentRepository: AppointmentRepository){
        this.appointmentRepository = appointmentRepository;
        this.doctorService = new DoctorServiceImpl(new DoctorRepository());
        this.patientService = new PatientServiceImpl(new PatientRepository());
    }

    public getAllAppointment(): Promise<Appointment[]> {
        try{
            return this.appointmentRepository.getAllAppointment();
        }catch(error){
            throw new GetAllError('appointment', 'AppointmentService', error);
        }
    }

    public async createAppointment(appointmentReq: AppointmentReq): Promise<AppointmentRes> {
            
        try{
            const identificacionPaciente = appointmentReq.identificacionPaciente;
            
            const patient:any = await this.patientService.getPatientByIdentificacion(identificacionPaciente);
            if (!patient){
                throw new RecordNotFoundError("Patient");
            }

            const id_doctor = parseInt(appointmentReq.id_doctor);
            const doctor:any = await this.doctorService.getDoctorById(id_doctor);
            if (!doctor){
                throw new RecordNotFoundError("Doctor");
            }

            if (doctor.especialidad !== appointmentReq.especialidad){
                throw new CustomError(`Doctor ${doctor.apellido} is not from that especialidad`);
            }

            const appointment: Appointment = {
                id_doctor: id_doctor,
                id_paciente: patient[0].id_paciente,
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
            if (error instanceof RecordNotFoundError){
                throw error;
            }else if(error instanceof CustomError){
                throw error;
            }else{
                throw new CreateError('appointment', 'AppointmentService', error);
            }
        }   
    }

    public async getAppointmentById(id: number): Promise <AppointmentRes>{
        try{            
            const existAppointment = await this.appointmentRepository.getAppointmentById(id);
            if (!existAppointment){
                throw new RecordNotFoundError("Appointment");
            }

            const doctor:any = await this.doctorService.getDoctorById(existAppointment.id_doctor);
            const patient = await this.patientService.getPatientById(existAppointment.id_paciente);
            
            const appointmentRes: AppointmentRes = {
                identificacionPaciente: patient.identificacion,
                doctor: `${doctor.nombre} ${doctor.apellido}`,
                especialidad: doctor.especialidad,
                horario: existAppointment.horario,
                consultorio: doctor.consultorio,
            }

            return appointmentRes
        }catch(error){
            if (error instanceof RecordNotFoundError){
                throw error;
            }else{
                throw new GetError('appointment', 'AppointmentService', error);
            }
        }
    }

    public async getAppointmentsByPatient(identificacion: string): Promise <Appointment[]>{
        try{
            const patient:any = await this.patientService.getPatientByIdentificacion(identificacion);
            if (!patient){
                throw new RecordNotFoundError("Patient");
            }

            const id_paciente = patient[0].id_paciente;

            const appointmentsPatient:any = await this.appointmentRepository.getAppoinmentsByPatient(id_paciente);
            if (!appointmentsPatient.length){
                throw new RecordNotFoundError("Appointments");
            }

            return appointmentsPatient

        }catch(error){
            if (error instanceof RecordNotFoundError){
                throw error;
            }else{
                throw new GetError('appointment', 'AppointmentService', error);
            }
        }
    }

    public async deleteAppointmentById(id: number): Promise<Appointment>{
        try{
            const existAppointment = await this.appointmentRepository.getAppointmentById(id);
            if (!existAppointment){
                throw new RecordNotFoundError('Appointment');
            }
            this.appointmentRepository.deleteAppointmentById(id);
            return existAppointment
        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else{
                throw new DeleteError('appointment', 'AppointmentService', error) 
            }
        }
    }
}