import {Request, Response} from 'express'
import { AppointmentService } from './service'
import logger from '../../../utils/logger'

export interface AppointmentController {
    /* getAllPatients(req: Request, res: Response): Promise<void> */
    createAppointment(req: Request, res: Response): Promise<void>
    getAppointmentById(req: Request, res: Response): Promise<void>
    /* getPatientByCedula(req: Request, res: Response): Promise<void> */
    /* updatePatientById(req: Request, res: Response): Promise<void> */
    /* deletePatientById(req: Request, res: Response): Promise<void> */
}

export class AppointmentControllerImpl implements AppointmentController {

    private appointmentService: AppointmentService;

    constructor (appointmentService: AppointmentService){
        this.appointmentService = appointmentService;
    }
    
/*     public async getAllPatients(req: Request, res: Response): Promise<void> {
        await this.patientService.getAllPatients()
        .then((getAllPatients)=>{
            res.status(200).json(getAllPatients);
        },
        (error) => {
            res.status(400).json({message: `${error.message}`}) 
        })
    } */

    public async createAppointment(req: Request, res: Response): Promise<void> {
        const appointmentReq = req.body
        await this.appointmentService.createAppointment(appointmentReq)
        .then((appointmentRes)=>{
            logger.info(`New appointment created succesfully: ${JSON.stringify(appointmentRes)}`)
            res.status(201).json(appointmentRes)
        },
        (error) => {
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async getAppointmentById(req: Request, res: Response):Promise<void> {
        const id = req.params.id
        await this.appointmentService.getAppointmentById(id)
        .then((appointment)=>{
            res.status(200).json(appointment)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }

 /*    public async getPatientByCedula(req: Request, res: Response):Promise<void> {
        const patientReq = req.body
        const identificacion = patientReq.identificacion
        await this.patientService.getPatientByCedula(identificacion)
        .then((patient)=>{
            res.status(200).json(patient)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    } */

/*     public async updatePatientById(req: Request, res: Response):Promise<void> {
        const id = req.params.id
        const patientReq = req.body; 
        await this.patientService.updatePatientById(id, patientReq)
        .then((patient)=>{
            logger.info(`Patient updated succesfully: ${JSON.stringify(patient)}`)
            res.status(200).json(patient)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    } */

/*     public async deletePatientById(req: Request, res: Response):Promise<void> {
        const id = req.params.id
        await this.patientService.deletePatientById(id)
        .then((patient)=>{
            res.status(200).json({message: "Patient deleted succesfully"})
            logger.info(`Patient deleted succesfully: ${JSON.stringify(patient)}`)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    } */
}

