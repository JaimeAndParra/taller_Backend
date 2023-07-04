import {Router} from 'express'
import { AppointmentController, AppointmentControllerImpl } from './controller'
import { AppointmentService, AppointmentServiceImpl } from './service'
import { AppointmentRepository } from './repository'

const appointmentRepository: AppointmentRepository = new AppointmentRepository();
const appointmentService: AppointmentService = new AppointmentServiceImpl(appointmentRepository);
const appointmentController: AppointmentController = new AppointmentControllerImpl(appointmentService);

const router = Router()
router.get('/list', appointmentController.getAllAppointments.bind(appointmentController));
router.post('/create', appointmentController.createAppointment.bind(appointmentController ));
router.get('/:id', appointmentController.getAppointmentById.bind(appointmentController ));
router.post('/patient', appointmentController.getAppointmentByPatient.bind(appointmentController ));
router.delete('/:id', appointmentController.deleteAppointmentById.bind(appointmentController));


export default router