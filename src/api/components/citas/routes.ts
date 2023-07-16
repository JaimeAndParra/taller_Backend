import {Router} from 'express'
import { AppointmentController, AppointmentControllerImpl } from './controller'
import { AppointmentService, AppointmentServiceImpl } from './service'
import { AppointmentRepository } from './repository'
import { PatientRepository } from '../pacientes/repository'
import { PatientService, PatientServiceImpl } from '../pacientes/service'
import { DoctorRepository } from '../doctores/repository'
import { DoctorService, DoctorServiceImpl } from '../doctores/service'

const patientRepository: PatientRepository = new PatientRepository();
const patientService: PatientService = new PatientServiceImpl(patientRepository);
const doctorRepository: DoctorRepository = new DoctorRepository();
const doctorService: DoctorService = new DoctorServiceImpl(doctorRepository);
const appointmentRepository: AppointmentRepository = new AppointmentRepository();
const appointmentService: AppointmentService = new AppointmentServiceImpl(appointmentRepository);
const appointmentController: AppointmentController = new AppointmentControllerImpl(appointmentService, patientService, doctorService);

const router = Router()
router.post('/create', appointmentController.createAppointment.bind(appointmentController));
router.get('/list', appointmentController.getAllAppointments.bind(appointmentController));
router.get('/:id', appointmentController.getAppointmentById.bind(appointmentController ));
router.patch('/patient', appointmentController.getAppointmentByPatient.bind(appointmentController ));
router.delete('/:id', appointmentController.deleteAppointmentById.bind(appointmentController));


export default router