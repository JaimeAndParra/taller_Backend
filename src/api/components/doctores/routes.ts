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
router.post('/search', doctorController.getDoctorByIdentificacion.bind(doctorController));
router.get('/:id', doctorController.getDoctorById.bind(doctorController));
router.put('/:id', doctorController.updateDoctorById.bind(doctorController));
router.delete('/:id', doctorController.deleteDoctorById.bind(doctorController));

export default router