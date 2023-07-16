import {Request, Response} from 'express'
import { AppointmentService } from './service'
import logger from '../../../utils/logger'
import { createAppointmentSchema, identificacionSchema } from './validations/appointment.validation'
import { DoctorService, DoctorServiceImpl } from '../doctores/service'
import { DoctorRepository } from '../doctores/repository'
import { PatientService, PatientServiceImpl } from '../pacientes/service'
import { PatientRepository } from '../pacientes/repository'
import { Doctor } from '../doctores/model'
import { CustomError } from '../../../utils/customError'
import { Patient } from '../pacientes/model'
import { AppointmentRes } from './model'

export interface AppointmentController {
    getAllAppointments(req: Request, res: Response): Promise<void>
    createAppointment(req: Request, res: Response): Promise<void>
    getAppointmentById(req: Request, res: Response): Promise<void>
    getAppointmentByPatient(req: Request, res: Response): Promise<void>
    deleteAppointmentById(req: Request, res: Response):Promise<void>
}

export class AppointmentControllerImpl implements AppointmentController {

    private appointmentService: AppointmentService;
    private doctorService: DoctorService;
    private patientService: PatientService;

    constructor (appointmentService: AppointmentService){
        this.appointmentService = appointmentService;
        this.patientService = new PatientServiceImpl(new PatientRepository());
        this.doctorService = new DoctorServiceImpl(new DoctorRepository());
    }
    
    public async getAllAppointments(req: Request, res: Response): Promise<void> {
        await this.appointmentService.getAllAppointment()
        .then((allAppointment)=>{
            res.status(200).json(allAppointment);
        })
        .catch((error) => {
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async createAppointment(req: Request, res: Response): Promise<void> {
        const {error, value} = createAppointmentSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.patientService.getPatientByIdentificacion(value.identificacionPaciente)
        .then(async (patient)=>{
            const doctor: Doctor = await this.doctorService.getDoctorById(value.id_doctor);
            if (doctor.especialidad !== value.especialidad) throw new CustomError(`Doctor ${doctor.apellido} is not from that especialidad`);
            return ({doctor, patient})
        })
        .then(async ({doctor, patient})=>{
            return await this.appointmentService.createAppointment(patient, doctor, value)
        })
        .then((appointmentRes)=>{
            logger.info(`New appointment created succesfully: ${JSON.stringify(appointmentRes)}`)
            res.status(201).json(appointmentRes)
        })
        .catch((error) => {
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async getAppointmentById(req: Request, res: Response):Promise<void> {
        const id = parseInt(req.params.id)
        if(isNaN(id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        await this.appointmentService.getAppointmentById(id)
        .then(async (appointment) => {
            const doctor: Doctor = await this.doctorService.getDoctorById(appointment.id_doctor);
            const patient: Patient = await this.patientService.getPatientById(appointment.id_paciente);

            const appointmentRes: AppointmentRes = {
                identificacionPaciente: patient.identificacion,
                doctor: `${doctor.nombre} ${doctor.apellido}`,
                especialidad: doctor.especialidad,
                horario: appointment.horario,
                consultorio: doctor.consultorio,
            }

            res.status(200).json(appointmentRes)
        })
        .catch((error)=>{
            res.status(400).json({message: error.message}) 
        })
    }

    public async getAppointmentByPatient(req: Request, res: Response): Promise<void> {
        const {error, value} = identificacionSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.patientService.getPatientByIdentificacion(value.identificacion)
        .then(async (patient) => {
            return await this.appointmentService.getAppointmentsByPatient(patient.id_paciente)
        })
        .then(async (appointmentsPatient)=>{
            const doctors: any = {};
            const appointmentsPatientRes: any = [];
            let doctor: Doctor;
            
            for (const appointment of appointmentsPatient){
                if(!doctors[appointment.id_doctor]){
                    doctor = await this.doctorService.getDoctorById(appointment.id_doctor);
                    doctors[appointment.id_doctor] = doctor;
                }else{
                    doctor = doctors[appointment.id_doctor];
                }
                appointmentsPatientRes.push({
                    doctor: `${doctor.nombre} ${doctor.apellido}`,
                    especialidad: doctor.especialidad,
                    horario: appointment.horario,
                    consultorio: doctor.consultorio,
                })
            }

            res.status(201).json(appointmentsPatientRes)
        })
        .catch((error)=>{
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async deleteAppointmentById(req: Request, res: Response):Promise<void> {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        await this.appointmentService.getAppointmentById(id)
        .then(async (appointment)=>{
            return await this.appointmentService.deleteAppointmentById(appointment.id_cita)
        })
        .then((appointment)=>{
            res.status(200).json({message: "Appointment deleted succesfully"})
            logger.info(`Appointment deleted succesfully: ${JSON.stringify(appointment)}`)
        })
        .catch((error) => {
            res.status(400).json({message: error.message}) 
        })
    }
}

