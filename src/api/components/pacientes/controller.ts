import {Request, Response} from 'express'
import { PatientService } from './service'
import logger from '../../../utils/logger'

export interface PatientController {
    getAllPatients(req: Request, res: Response): Promise<void>
    createPatient(req: Request, res: Response): Promise<void>
    getPatientById(req: Request, res: Response): Promise<void>
    getPatientByCedula(req: Request, res: Response): Promise<void>
    updatePatientById(req: Request, res: Response): Promise<void>
    deletePatientById(req: Request, res: Response): Promise<void>
}

export class PatientControllerImpl implements PatientController {

    private patientService: PatientService;

    constructor (patientService: PatientService){
        this.patientService = patientService;
    }
    
    public async getAllPatients(req: Request, res: Response): Promise<void> {
        await this.patientService.getAllPatients()
        .then((getAllPatients)=>{
            res.status(200).json(getAllPatients);
        },
        (error) => {
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async createPatient(req: Request, res: Response): Promise<void> {
        const patientReq = req.body
        await this.patientService.createPatient(patientReq)
        .then((patient)=>{
            logger.info(`New patient created succesfully: ${JSON.stringify(patient)}`)
            res.status(201).json(patient)
        },
        (error) => {
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async getPatientById(req: Request, res: Response):Promise<void> {
        const id = req.params.id
        await this.patientService.getPatientById(id)
        .then((patient)=>{
            res.status(200).json(patient)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }

    public async getPatientByCedula(req: Request, res: Response):Promise<void> {
        const patientReq = req.body
        const identificacion = patientReq.identificacion
        await this.patientService.getPatientByCedula(identificacion)
        .then((patient)=>{
            res.status(200).json(patient)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }

    public async updatePatientById(req: Request, res: Response):Promise<void> {
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
    }

    public async deletePatientById(req: Request, res: Response):Promise<void> {
        const id = req.params.id
        await this.patientService.deletePatientById(id)
        .then((patient)=>{
            res.status(200).json({message: "Patient deleted succesfully"})
            logger.info(`Patient deleted succesfully: ${JSON.stringify(patient)}`)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }
}


