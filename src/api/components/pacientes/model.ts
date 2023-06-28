/* Un modelo es una estructura de datos que se implementa a traves de una interface */
/* Las interfaces permiten desasociar  */

export interface Paciente {
    id_paciente: number,
    nombre: string,
    apellido: string,
    identificacion: string,
    telefono: string,
    createdAt?: Date, 
    updatedAt?: Date, 
}

