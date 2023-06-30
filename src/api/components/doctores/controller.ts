import {Request, Response} from 'express'
import { DoctorService } from './service'
import logger from '../../../utils/logger'

/* el controlador maneja los servicios a traves de las interfaces */
/* La interface solo tiene entradas/salidas y se encarga de 
   dar una definicion del servicio, sin detallar la manera en que lo hace */

export interface DoctorController {
    getAllDoctors(req: Request, res: Response): Promise<void>
    createDoctor(req: Request, res: Response): Promise<void>
}

export class DoctorControllerImpl implements DoctorController {

    private doctorService: DoctorService;

    constructor (doctorService: DoctorService){
        this.doctorService = doctorService;
    }
    
    public async getAllDoctors(req: Request, res: Response): Promise<void> {
        try{
            await this.doctorService.getAllDoctors()
            .then((allDoctors)=>{
                res.status(200).json(allDoctors);
            })
        }catch(error){
            res.status(400).json({message: "Error getting all doctors"})  
        }
    }

    public async createDoctor(req: Request, res: Response): Promise<void> {
        const doctorReq = req.body
        try{
            await this.doctorService.createDoctor(doctorReq)
            .then((doctor)=>{
                res.status(201).json(doctor)
            })
        }catch(error){
            res.status(400).json({message: "Error creating doctor"})  
        }
    }
}


