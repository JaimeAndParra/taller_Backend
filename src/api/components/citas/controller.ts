import {Cita} from './model'
import {Request, Response} from 'express'
import { CitaService } from './service'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

/* el controlador maneja los servicios a traves de las interfaces */
/* La interface solo tiene entradas/salidas y se encarga de 
   dar una definicion del servicio, sin detallar la manera en que lo hace */

export interface CitaController {
    createCita(req: Request, res: Response): void
    getAllCitas(req: Request, res: Response): void
}

export class CitaControllerImpl implements CitaController {

    private CitaService: CitaService;

    constructor (CitaService: CitaService){
        this.CitaService = CitaService;
    }
    
    public createCita(req: Request, res: Response): void {
        const cita: Cita | null = this.CitaService.createCita();
        res.json(cita);
    }

    public getAllCitas(req: Request, res: Response): void {
        const cita: Cita[] = this.CitaService.getAllCitas();
        res.json(cita);
    }
}


