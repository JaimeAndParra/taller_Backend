export interface Appointment {
    id_cita: number,
    id_doctor: number,
    id_paciente: number,
    horario: string,
    created_at: Date, 
    updated_at: Date, 
}

export interface AppointmentDBInsert {
    id_doctor: number,
    id_paciente: number,
    horario: string,
    created_at: Date, 
    updated_at: Date, 
}

export interface AppointmentReq {
    identificacionPaciente: string,
    especialidad: string,
    id_doctor: string,
    horario: string,
}

export interface AppointmentRes {
    identificacionPaciente: string,
    doctor: string,
    especialidad: string,
    horario: string,
    consultorio: string,
}

