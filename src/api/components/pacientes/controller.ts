import {Request, Response} from 'express'
import { PatientService } from './service'
import logger from '../../../utils/logger'
import { createPatientSchema, identificacionSchema, updatePatientSchema } from './validations/patient.validation'

export interface PatientController {
    getAllPatients(req: Request, res: Response): Promise<void>
    createPatient(req: Request, res: Response): Promise<void>
    getPatientById(req: Request, res: Response): Promise<void>
    getPatientByIdentificacion(req: Request, res: Response): Promise<void>
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
        .then((allPatients)=>{
            res.status(200).json(allPatients);
        })
        .catch((error)=>{
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async createPatient(req: Request, res: Response): Promise<void> {
        const {error, value} = createPatientSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.patientService.createPatient(value)
        .then((patient)=>{
            logger.info(`New patient created succesfully: ${JSON.stringify(patient)}`)
            res.status(201).json(patient)
        })
        .catch((error) => {
            res.status(400).json({message: `${error.message}`}) 
        })
    }

    public async getPatientById(req: Request, res: Response):Promise<void> {
        const id = parseInt(req.params.id)
        if(isNaN(id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        await this.patientService.getPatientById(id)
        .then((patient)=>{
            res.status(200).json(patient)
        })
        .catch((error) => {
            res.status(400).json({message: error.message}) 
        })
    }

    public async getPatientByIdentificacion(req: Request, res: Response):Promise<void> {
        const {error, value} = identificacionSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.patientService.getPatientByIdentificacion(value.identificacion)
        .then((patient)=>{
            res.status(200).json(patient)
        })
        .catch((error) => {
            res.status(400).json({message: error.message}) 
        })
    }

    public async updatePatientById(req: Request, res: Response):Promise<void> {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        const {error, value} = updatePatientSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.patientService.getPatientById(id)
        .then(async (patient) => {
            return await this.patientService.updatePatientById(patient, value)
        })
        .then((patientUpdate)=>{
            logger.info(`Patient updated succesfully: ${JSON.stringify(patientUpdate)}`)
            res.status(200).json(patientUpdate)
        })
        .catch((error) => {
            res.status(400).json({message: error.message}) 
        })
    }

    public async deletePatientById(req: Request, res: Response):Promise<void> {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        await this.patientService.getPatientById(id)
        .then(async (patient)=>{
            return await this.patientService.deletePatientById(patient)
        })
        .then((patient)=>{
            res.status(200).json({message: `Patient ${patient.nombre} ${patient.apellido} deleted succesfully`})
            logger.info(`Patient deleted succesfully: ${JSON.stringify(patient)}`)
        })
        .catch((error)=>{
            res.status(400).json({message: error.message}) 
        })
    }
}


