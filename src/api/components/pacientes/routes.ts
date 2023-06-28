/* Express permite configurar y levantar la aplicacion */

import {Router} from 'express'
import logger from '../../../utils/logger'
import { PacienteController, PacienteControllerImpl } from './controller'
import { PacienteService, PacienteServiceImpl } from './service'

const pacienteService: PacienteService = new PacienteServiceImpl();
const pacienteController: PacienteController = new PacienteControllerImpl(pacienteService);

const router = Router()
router.get('/create', pacienteController.createPaciente.bind(pacienteController));
router.get('/list', pacienteController.getPaciente.bind(pacienteController));

export default router

/* router.get('', (req: Request, res: Response) => {
    const doctores = [
        {id_doctor: 1, nombre: "John", apellido: "Doe", especialidad: "Pediatria", consultorio: 101, correo: "john.doe@gmail.com"},
        {id_doctor: 2, nombre: "Jose", apellido: "Rodriguez", especialidad: "Medicina General", consultorio: 102, correo: "jose.rodriguez@gmail.com"},
    ];
    res.json(doctores);
    logger.info("Access to doctores success: ");
}) */