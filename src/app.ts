/* Express permite configurar y levantar la aplicacion */

import express, {Request, Response} from 'express'

const app = express()
const port = 8087 

// Convierte los body de los request en json
app.use(express.json())

app.get('/api/v1/doctores', (req: Request, res: Response) => {
    const doctores = [
        {id_doctor: 1, nombre: "John", apellido: "Doe", especialidad: "Pediatria", consultorio: 101, correo: "john.doe@gmail.com"},
        {id_doctor: 2, nombre: "Jose", apellido: "Rodriguez", especialidad: "Medicina General", consultorio: 102, correo: "jose.rodriguez@gmail.com"},
    ];
    res.json(doctores);
})

app.listen(port, () => {
    console.log(`Server listening on port... ${port}`)
})

