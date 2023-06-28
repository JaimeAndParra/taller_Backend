/* El servicio es quien se encarga de ejecutar el modelo */
/* La interface se encarga de indicarle al controlador el uso del servicio */

import {Cita} from './model'

export interface CitaService {
    createCita(): Cita | null,
    getAllCitas(): Cita[]
}

export class CitaServiceImpl implements CitaService {
    public createCita(): Cita | null {
        return null
    }

    public getAllCitas(): Cita[] {
        return []
    }
}