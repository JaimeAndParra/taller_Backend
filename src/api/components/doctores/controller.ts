import {Doctor} from './model'
import {Request, Response} from 'express'
import { DoctorService } from './service'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

/* el controlador maneja los servicios a traves de las interfaces */
/* La interface solo tiene entradas/salidas y se encarga de 
   dar una definicion del servicio, sin detallar la manera en que lo hace */

export interface DoctorController {
    getAllDoctors(req: Request, res: Response): void
    createDoctor(req: Request, res: Response): void
}

export class DoctorControllerImpl implements DoctorController {

    private doctorService: DoctorService;

    constructor (doctorService: DoctorService){
        this.doctorService = doctorService;
    }
    
    public getAllDoctors(req: Request, res: Response): void {
        const doctors: Doctor[] = this.doctorService.getAllDoctors();        
        res.json(doctors);
    }

    public createDoctor(req: Request, res: Response): void {
        const doctor: Doctor = this.doctorService.createDoctor();
        res.send("Doctor Created")
    }
}


