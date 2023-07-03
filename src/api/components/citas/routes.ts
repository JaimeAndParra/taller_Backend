import {Router} from 'express'
import { AppointmentController, AppointmentControllerImpl } from './controller'
import { AppointmentService, AppointmentServiceImpl } from './service'
import { AppointmentRepository } from './repository'

const appointmentRepository: AppointmentRepository = new AppointmentRepository();
const appointmentService: AppointmentService = new AppointmentServiceImpl(appointmentRepository);
const appointmentController: AppointmentController = new AppointmentControllerImpl(appointmentService);

const router = Router()
router.post('/create', appointmentController.createAppointment.bind(appointmentController ));
router.get('/:id', appointmentController.getAppointmentById.bind(appointmentController ));

export default router