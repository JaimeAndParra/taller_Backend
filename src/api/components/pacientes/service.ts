/* El servicio es quien se encarga de ejecutar el modelo */
/* La interface se encarga de indicarle al controlador el uso del servicio */

import {Paciente} from './model'

export interface PacienteService {
    getPaciente(): Paciente|null
    createPaciente(): Paciente|null
}

export class PacienteServiceImpl implements PacienteService {
    public getPaciente(): Paciente|null {

        const paciente = [
            {id_paciente: 1, nombre: "John", apellido: "Doe", especialidad: "Pediatria", consultorio: "101", correo: "john.doe@gmail.com", createdAt: new Date()},
        ];

        return null;
    }

    public createPaciente(): Paciente|null {
        return null
    }
}