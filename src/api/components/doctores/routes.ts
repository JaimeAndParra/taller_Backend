/* Express permite configurar y levantar la aplicacion */

import {Router} from 'express'
import { DoctorController, DoctorControllerImpl } from './controller'
import { DoctorService, DoctorServiceImpl } from './service'
import { DoctorRepository } from './repository'

const doctorRepository: DoctorRepository = new DoctorRepository();
const doctorService: DoctorService = new DoctorServiceImpl(doctorRepository);
const doctorController: DoctorController = new DoctorControllerImpl(doctorService);

const router = Router()
router.get('/list', doctorController.getAllDoctors.bind(doctorController));
router.post('/create', doctorController.createDoctor.bind(doctorController));
router.get('/:id', doctorController.getDoctorById.bind(doctorController));
router.put('/:id', doctorController.updateDoctorById.bind(doctorController));
router.delete('/:id', doctorController.deleteDoctorById.bind(doctorController));

export default router

/* router.get('', (req: Request, res: Response) => {
    const doctores = [
        {id_doctor: 1, nombre: "John", apellido: "Doe", especialidad: "Pediatria", consultorio: 101, correo: "john.doe@gmail.com"},
        {id_doctor: 2, nombre: "Jose", apellido: "Rodriguez", especialidad: "Medicina General", consultorio: 102, correo: "jose.rodriguez@gmail.com"},
    ];
    res.json(doctores);
    logger.info("Access to doctores success: ");
}) */