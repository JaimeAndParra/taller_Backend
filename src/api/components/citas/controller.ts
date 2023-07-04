import {Request, Response} from 'express'
import { AppointmentService } from './service'
import logger from '../../../utils/logger'
import { createAppointmentSchema, identificacionSchema } from './validations/appointment.validation'

export interface AppointmentController {
    getAllAppointments(req: Request, res: Response): Promise<void>
    createAppointment(req: Request, res: Response): Promise<void>
    getAppointmentById(req: Request, res: Response): Promise<void>
    getAppointmentByPatient(req: Request, res: Response): Promise<void>
    deleteAppointmentById(req: Request, res: Response):Promise<void>
}

export class AppointmentControllerImpl implements AppointmentController {

    private appointmentService: AppointmentService;

    constructor (appointmentService: AppointmentService){
        this.appointmentService = appointmentService;
    }
    
    public async getAllAppointments(req: Request, res: Response): Promise<void> {
        await this.appointmentService.getAllAppointment()
        .then((allAppointment)=>{
            res.status(200).json(allAppointment);
        },
        (error) => {
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async createAppointment(req: Request, res: Response): Promise<void> {
        const {error, value} = createAppointmentSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.appointmentService.createAppointment(value)
        .then((appointmentRes)=>{
            logger.info(`New appointment created succesfully: ${JSON.stringify(appointmentRes)}`)
            res.status(201).json(appointmentRes)
        },
        (error) => {
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
        .then((appointment)=>{
            res.status(200).json(appointment)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }

    public async getAppointmentByPatient(req: Request, res: Response): Promise<void> {
        const {error, value} = identificacionSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.appointmentService.getAppointmentsByPatient(value.identificacion)
        .then((appointmentsPatient)=>{
            res.status(201).json(appointmentsPatient)
        },
        (error) => {
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async deleteAppointmentById(req: Request, res: Response):Promise<void> {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        await this.appointmentService.deleteAppointmentById(id)
        .then((appointment)=>{
            res.status(200).json({message: "Appointment deleted succesfully"})
            logger.info(`Appointment deleted succesfully: ${JSON.stringify(appointment)}`)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }
}

