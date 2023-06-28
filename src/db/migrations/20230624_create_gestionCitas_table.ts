import {Knex} from 'knex'


/* Las funciones que levantan la migracion son up */
/* Las funciones que hacen rollback son down (no es necesario) */
export async function up(knex:Knex): Promise<void> {
    await knex.raw(
        `
            CREATE TABLE IF NOT EXISTS doctores (
                id_doctor bigserial,
                nombre VARCHAR,
                apellido VARCHAR,
                especialidad VARCHAR,
                consultorio VARCHAR,
                correo VARCHAR,
                created_at TIMESTAMPTZ,
                updated_at TIMESTAMPTZ,
                PRIMARY key(id_doctor)
            );
            
            CREATE TABLE IF NOT EXISTS pacientes (
                id_paciente bigserial,
                nombre VARCHAR,
                apellido VARCHAR,
                identificacion VARCHAR,
                telefono VARCHAR,
                created_at TIMESTAMPTZ,
                updated_at TIMESTAMPTZ,
                PRIMARY key(id_paciente)
            );
            
            CREATE TABLE IF NOT EXISTS citas (
                id_cita bigserial,
                horario VARCHAR,
                id_doctor bigint,
                id_paciente bigint,
                created_at TIMESTAMPTZ,
                updated_at TIMESTAMPTZ,
                PRIMARY KEY(id_cita),
                CONSTRAINT fk_doctor FOREIGN key(id_doctor) REFERENCES doctores(id_doctor),
                CONSTRAINT fk_paciente FOREIGN key(id_paciente) REFERENCES pacientes(id_paciente)
            );
        `        
    );
}

export async function down(knex:Knex): Promise <void> {
    await knex.raw(
        `
            DROP TABLE doctores;
            DROP TABLE pacientes;
            DROP TABLE citas;
        `
    )
}