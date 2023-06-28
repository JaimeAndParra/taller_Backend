import {Paciente} from './model'
import {Request, Response} from 'express'
import { PacienteService } from './service'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

/* el controlador maneja los servicios a traves de las interfaces */
/* La interface solo tiene entradas/salidas y se encarga de 
   dar una definicion del servicio, sin detallar la manera en que lo hace */

export interface PacienteController {
    getPaciente(req: Request, res: Response): void
    createPaciente(req: Request, res: Response): void
}

export class PacienteControllerImpl implements PacienteController {

    private pacienteService: PacienteService;

    constructor (PacienteService: PacienteService){
        this.pacienteService = PacienteService;
    }
    
    public getPaciente(req: Request, res: Response): void {
        const paciente: Paciente|null = this.pacienteService.getPaciente();
        res.json(paciente);
    }

    public createPaciente(req: Request, res: Response): void {
        const paciente: Paciente|null = this.pacienteService.createPaciente();
        res.json(paciente);
        
    }
}


