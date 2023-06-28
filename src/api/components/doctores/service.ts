/* El servicio es quien se encarga de ejecutar el modelo */
/* La interface se encarga de indicarle al controlador el uso del servicio */

import {Doctor} from './model'

export interface DoctorService {
    getAllDoctors(): Doctor[],
    createDoctor(): Doctor,
}

export class DoctorServiceImpl implements DoctorService {
    public getAllDoctors(): Doctor[] {

        const doctores = [
            {id_doctor: 1, nombre: "John", apellido: "Doe", especialidad: "Pediatria", consultorio: "101", correo: "john.doe@gmail.com", createdAt: new Date()},
            {id_doctor: 2, nombre: "Jose", apellido: "Rodriguez", especialidad: "Medicina General", consultorio: "102", correo: "jose.rodriguez@gmail.com"},
        ];

        return doctores;
    }

    public createDoctor(): Doctor {
        return {id_doctor: 2, nombre: "Jose", apellido: "Rodriguez", especialidad: "Medicina General", consultorio: "102", correo: "jose.rodriguez@gmail.com"}
    }
}