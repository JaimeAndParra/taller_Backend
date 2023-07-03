import {Router} from 'express'
import { PatientController, PatientControllerImpl } from './controller'
import { PatientService, PatientServiceImpl } from './service'
import { PatientRepository } from './repository'

const patientRepository: PatientRepository = new PatientRepository();
const patientService: PatientService = new PatientServiceImpl(patientRepository);
const patientController: PatientController = new PatientControllerImpl(patientService);

const router = Router()
router.get('/list', patientController.getAllPatients.bind(patientController));
router.get('/search', patientController.getPatientByCedula.bind(patientController));
router.post('/create', patientController.createPatient.bind(patientController));
router.get('/:id', patientController.getPatientById.bind(patientController));
router.put('/:id', patientController.updatePatientById.bind(patientController));
router.delete('/:id', patientController.deletePatientById.bind(patientController));

export default router