export interface Patient {
    id_paciente?: number,
    nombre: string,
    apellido: string,
    identificacion: string,
    telefono?: string,
    created_at?: Date, 
    updated_at?: Date, 
}

export interface PatientReq{
    nombre: string,
    apellido: string,
    identificacion: string,
    telefono?: string,
}

