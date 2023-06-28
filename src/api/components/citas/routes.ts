/* Express permite configurar y levantar la aplicacion */

import {Router} from 'express'
import logger from '../../../utils/logger'
import { CitaController, CitaControllerImpl } from './controller'
import { CitaService, CitaServiceImpl } from './service'

const CitaService: CitaService = new CitaServiceImpl();
const CitaController: CitaController = new CitaControllerImpl(CitaService);

const router = Router()
router.post('/create', CitaController.createCita.bind(CitaController));
router.get('/list', CitaController.getAllCitas.bind(CitaController));

export default router

/* router.get('', (req: Request, res: Response) => {
    const doctores = [
        {id_doctor: 1, nombre: "John", apellido: "Doe", especialidad: "Pediatria", consultorio: 101, correo: "john.doe@gmail.com"},
        {id_doctor: 2, nombre: "Jose", apellido: "Rodriguez", especialidad: "Medicina General", consultorio: 102, correo: "jose.rodriguez@gmail.com"},
    ];
    res.json(doctores);
    logger.info("Access to doctores success: ");
}) */