export interface Doctor {
    id_doctor?: number,
    nombre: string,
    apellido: string,
    especialidad: string,
    consultorio: string,
    correo: string,
    identificacion: string,
    created_at?: Date, 
    updated_at?: Date,
}

export interface DoctorReq {
    nombre: string,
    apellido: string,
    especialidad: string,
    consultorio: string,
    correo: string,
    identificacion: string,
}


