/* Un modelo es una estructura de datos que se implementa a traves de una interface */
/* Las interfaces permiten desasociar  */

export interface Doctor {
    id_doctor?: number,
    nombre: string,
    apellido: string,
    especialidad: string,
    consultorio: string,
    correo: string,
    created_at?: Date, 
    updated_at?: Date,
}

export interface DoctorReq {
    nombre: string,
    apellido: string,
    especialidad: string,
    consultorio: string,
    correo: string,
}


