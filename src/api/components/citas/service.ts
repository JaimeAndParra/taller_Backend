import { RecordNotFoundError, AppointmentError, MustBeANumber, CustomError } from '../../../config/customError';
import { DoctorRepository } from '../doctores/repository';
import { PatientRepository } from '../pacientes/repository';
import { DoctorService, DoctorServiceImpl } from '../doctores/service';
import { PatientService, PatientServiceImpl } from '../pacientes/service';
import { Appointment, AppointmentReq, AppointmentRes} from './model'
import { AppointmentRepository } from './repository';

export interface AppointmentService {
    /* getAllPatients(): Promise<Patient[]>, */
    createAppointment(appointmentReq: AppointmentReq): Promise<AppointmentRes>,
    getAppointmentById(idReq: string): Promise<AppointmentRes>,
    /* updatePatientById(idReq: string, update: Partial<PatientReq>): Promise<Patient>
    deletePatientById(idReq: string): Promise<Patient>, */
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

   /*  public getAllPatients(): Promise<Patient[]> {
        try{
            return this.patientRepository.getAllPatients();
        }catch(error){
            throw new PatientError("Error getting all patients", "patientService", error)
        }
    } */

    public async createAppointment(appointmentReq: AppointmentReq): Promise<AppointmentRes> {
        
        try{
            const patient = await this.patientService.getPatientByCedula(appointmentReq.identificacionPaciente);            
            
            if (typeof patient.id_paciente == 'undefined'){
                throw new RecordNotFoundError();
            }

            const doctor = await this.doctorService.getDoctorById(appointmentReq.id_doctor);
            if (!doctor){
                throw new RecordNotFoundError();
            }

            if (doctor.especialidad !== appointmentReq.especialidad){
                throw new CustomError(`Doctor ${doctor.nombre} is not from that especialidad`);
            }

            const appointment: Appointment = {
                id_doctor: parseInt(appointmentReq.id_doctor),
                id_paciente: patient.id_paciente,
                horario: appointmentReq.horario,
                especialidad: appointmentReq.especialidad,
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
            if(error instanceof CustomError){
                throw error;
            }else{
                throw new AppointmentError("Error creating appointment", "AppointmentService", error)
            }
        }   
    }

    public async getAppointmentById(idReq: string): Promise <AppointmentRes>{
        try{
            const id = parseInt(idReq);
            if(isNaN(id)){
                throw new MustBeANumber();
            }
            
            const existAppointment = await this.appointmentRepository.getAppointmentById(id);
            if (!existAppointment){
                throw new RecordNotFoundError();
            }

            const doctor = await this.doctorService.getDoctorById(existAppointment.id_doctor.toString());
            if (!doctor){
                throw new CustomError("Ups. The doctor no longer works with us.");
            }

            const patient = await this.patientService.getPatientById(existAppointment.id_paciente.toString());
            if (!patient){
                throw new CustomError("Ups. You are no longer affiliated with us.");
            }
            
            const appointmentRes: AppointmentRes = {
                identificacionPaciente: patient.identificacion,
                doctor: `${doctor.nombre} ${doctor.apellido}`,
                especialidad: doctor.especialidad,
                horario: existAppointment.horario,
                consultorio: doctor.consultorio,
            }

            return appointmentRes

        }catch(error){
            if(error instanceof RecordNotFoundError){
                throw error;
            }else if(error instanceof MustBeANumber){
                throw error;
            }else{
                throw new AppointmentError("Error getting appointment", "AppointmentService", error)
            }
        }
    }

    /* public async updatePatientById(idReq: string, update: Partial<PatientReq>): Promise<Patient>{
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
    } */

    /* public async deletePatientById(idReq: string): Promise<Patient>{
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
    } */
}