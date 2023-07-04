import {Request, Response} from 'express'
import { DoctorService } from './service'
import logger from '../../../utils/logger'
import { createDoctorSchema, identificacionSchema, updateDoctorSchema } from './validations/doctor.validation'

export interface DoctorController {
    getAllDoctors(req: Request, res: Response): Promise<void>
    createDoctor(req: Request, res: Response): Promise<void>
    getDoctorById(req: Request, res: Response): Promise<void>
    getDoctorByIdentificacion(req: Request, res: Response): Promise<void>
    updateDoctorById(req: Request, res: Response): Promise<void>
    deleteDoctorById(req: Request, res: Response): Promise<void>
}

export class DoctorControllerImpl implements DoctorController {

    private doctorService: DoctorService;

    constructor (doctorService: DoctorService){
        this.doctorService = doctorService;
    }
    
    public async getAllDoctors(req: Request, res: Response): Promise<void> {
        await this.doctorService.getAllDoctors()
        .then((allDoctors)=>{
            res.status(200).json(allDoctors);
        },
        (error) => {
            res.status(400).json({message: `${error.message}`}); 
        })
    }

    public async createDoctor(req: Request, res: Response): Promise<void> {    
        const {error, value} = createDoctorSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.doctorService.createDoctor(value)
        .then((doctor)=>{
            logger.info(`New doctor created succesfully: ${JSON.stringify(doctor)}`);
            res.status(201).json(doctor);
        },
        (error) => {
            res.status(400).json({message: `${error.message}`});
        })
    }

    public async getDoctorById(req: Request, res: Response):Promise<void> {
        const id = parseInt(req.params.id)
        if(isNaN(id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        await this.doctorService.getDoctorById(id)
        .then((doctor)=>{
            res.status(200).json(doctor)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }

    public async getDoctorByIdentificacion(req: Request, res: Response):Promise<void> {
        const {error, value} = identificacionSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.doctorService.getDoctorByIdentificacion(value.identificacion)
        .then((doctor)=>{
            res.status(200).json(doctor)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }

    public async updateDoctorById(req: Request, res: Response):Promise<void> {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        const {error, value} = updateDoctorSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }
        await this.doctorService.updateDoctorById(id, value)
        .then((doctor)=>{
            logger.info(`Doctor updated succesfully: ${JSON.stringify(doctor)}`)
            res.status(200).json(doctor)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }

    public async deleteDoctorById(req: Request, res: Response):Promise<void> {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        await this.doctorService.deleteDoctorById(id)
        .then((doctor)=>{
            res.status(200).json({message: "Doctor deleted succesfully"})
            logger.info(`Doctor deleted succesfully: ${JSON.stringify(doctor)}`)
        },
        (error)=>{
            res.status(400).json({message: error.message}) 
        })
    }
}


