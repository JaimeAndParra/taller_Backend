import { Request, Response } from "express";
import { AppointmentController, AppointmentControllerImpl } from "../api/components/citas/controller";
import { AppointmentService } from "../api/components/citas/service";
import { Appointment, AppointmentReq, AppointmentRes } from "../api/components/citas/model";
import { PatientService } from "../api/components/pacientes/service";
import { Patient } from "../api/components/pacientes/model";
import { DoctorService } from "../api/components/doctores/service";
import { Doctor } from "../api/components/doctores/model";
import { CreateError, CustomError, DeleteError, GetError, RecordNotFoundError } from "../utils/customError";
import { custom } from "joi";

const reqMock = {} as Request;
const resMock = {} as Response;

describe('CitasController', () => {
    let appointmentController: AppointmentController;
    let appointmentService: AppointmentService;
    let patientService: PatientService;
    let doctorService: DoctorService;
    let nowDate: Date;
    let appointment1: Appointment;
    let appointment2: Appointment;
    let appointments: Appointment[];
    let patient: Patient;
    let doctor: Doctor;

    beforeEach(() => {
        appointmentService = {
            getAllAppointment: jest.fn(),
            createAppointment: jest.fn(),
            getAppointmentById: jest.fn(),
            getAppointmentsByPatient: jest.fn(),
            deleteAppointmentById: jest.fn(),            
        };
        patientService = {
            createPatient: jest.fn(),
            deletePatientById: jest.fn(),
            getAllPatients: jest.fn(),
            getPatientById: jest.fn(),
            getPatientByIdentificacion: jest.fn(),
            updatePatientById: jest.fn(),
        };
        doctorService = {
            createDoctor: jest.fn(),
            deleteDoctorById: jest.fn(),
            getAllDoctors: jest.fn(),
            getDoctorById: jest.fn(),
            getDoctorByIdentificacion: jest.fn(),
            updateDoctorById: jest.fn(),
        };
        appointmentController = new AppointmentControllerImpl(appointmentService, patientService, doctorService);
        resMock.status = jest.fn().mockReturnThis();
        resMock.json = jest.fn().mockReturnThis();
        nowDate = new Date();
        appointment1 = {
            id_doctor: 1,
            id_cita: 1,
            id_paciente: 100,
            horario: "Lunes 17/07/2023 8:00",
            updated_at: nowDate,
            created_at: nowDate
        };
        appointment2 = {
            id_doctor: 2,
            id_cita: 2,
            id_paciente: 200,
            horario: "Lunes 17/07/2023 8:00",
            updated_at: nowDate,
            created_at: nowDate
        };
        appointments = [appointment1, appointment2];
        patient = {
            id_paciente: 1,
            nombre: "Angela",
            apellido: "Nicols",
            identificacion: "123",
            telefono: "666-666-66",            
            updated_at: nowDate,
            created_at: nowDate
        };
        doctor = {
            id_doctor: 1,
            nombre: "John",
            apellido: "Doe",
            identificacion: "123",
            especialidad: "Medicina general",
            consultorio: "101",
            correo: "john.doe@gmail.com",
            updated_at: nowDate,
            created_at: nowDate
        };
    })

    describe('getAllAppointments', () => {
        it('should be get all appointments', async () => {
            (appointmentService.getAllAppointment as jest.Mock).mockResolvedValue(appointments)
            await appointmentController.getAllAppointments(reqMock, resMock)
            expect(appointmentService.getAllAppointment).toHaveBeenCalled()
            expect(resMock.json).toHaveBeenCalledWith(appointments)
            expect(resMock.status).toHaveBeenCalledWith(200) 
        })
        it('should be handler error from service and return 400 status', async () => {
            const error = new Error('Database Error');
            (appointmentService.getAllAppointment as jest.Mock).mockRejectedValue(error);
            await appointmentController.getAllAppointments(reqMock, resMock)

            expect(appointmentService.getAllAppointment).toHaveBeenCalled()
            expect(resMock.json).toHaveBeenCalledWith({message: "Database Error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })

    describe('createAppointment', () => {
        it('should be create an appointment and return info', async () => {
            const appointmentReq: AppointmentReq = {
                identificacionPaciente: "123",
                especialidad: "Medicina general",
                id_doctor: "1",
                horario: "Lunes 17/07/2023 8:00am",
            }; 

            (reqMock.body as AppointmentReq) = appointmentReq;

            (patientService.getPatientByIdentificacion as jest.Mock).mockResolvedValue(patient);
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            (appointmentService.createAppointment as jest.Mock).mockResolvedValue(appointment1);
            await appointmentController.createAppointment(reqMock, resMock)

            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(appointmentReq.identificacionPaciente);
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(appointmentReq.id_doctor);
            expect(appointmentService.createAppointment).toHaveBeenCalledWith(patient, doctor, appointmentReq);
            expect(resMock.json).toHaveBeenCalledWith(appointment1);
            expect(resMock.status).toHaveBeenCalledWith(201);
        }) 
        it('should be handler error and return 400 when body request is wrong', async () => {
            const appointmentReq: any = {
                especialidad: "Medicina general",
                id_doctor: "1",
                horario: "Lunes 17/07/2023 8:00am",
            }; 

            (reqMock.body as any) = appointmentReq;

            await appointmentController.createAppointment(reqMock, resMock)
            expect(resMock.json).toHaveBeenCalledWith({"message": "\"identificacionPaciente\" is required"});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
        it('should be return 400 when patient not found', async () => {
            const appointmentReq: AppointmentReq = {
                identificacionPaciente: "1234",
                especialidad: "Medicina general",
                id_doctor: "1",
                horario: "Lunes 17/07/2023 8:00am",
            }; 

            const recordError = new RecordNotFoundError('Patient');

            (reqMock.body as AppointmentReq) = appointmentReq;

            (patientService.getPatientByIdentificacion as jest.Mock).mockRejectedValue(recordError);
            await appointmentController.createAppointment(reqMock, resMock)

            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(appointmentReq.identificacionPaciente);
            expect(resMock.json).toHaveBeenCalledWith({"message": "Patient has not been found."});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
        it('should be return 400 when doctor not found', async () => {
            const appointmentReq: AppointmentReq = {
                identificacionPaciente: "123",
                especialidad: "Medicina general",
                id_doctor: "3",
                horario: "Lunes 17/07/2023 8:00am",
            }; 

            const recordError = new RecordNotFoundError('Doctor');

            (reqMock.body as AppointmentReq) = appointmentReq;

            (patientService.getPatientByIdentificacion as jest.Mock).mockResolvedValue(patient);
            (doctorService.getDoctorById as jest.Mock).mockRejectedValue(recordError);
            await appointmentController.createAppointment(reqMock, resMock)

            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(appointmentReq.identificacionPaciente);
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(appointmentReq.id_doctor);
            expect(resMock.json).toHaveBeenCalledWith({"message": "Doctor has not been found."});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
        it('should be return 400 when doctor especialidad doesnt match with request', async () => {
            const appointmentReq: AppointmentReq = {
                identificacionPaciente: "123",
                especialidad: "Medicina interna",
                id_doctor: "3",
                horario: "Lunes 17/07/2023 8:00am",
            }; 

            const customError = new CustomError(`Doctor ${doctor.apellido} is not from that especialidad`);

            (reqMock.body as AppointmentReq) = appointmentReq;

            (patientService.getPatientByIdentificacion as jest.Mock).mockResolvedValue(patient);
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            await appointmentController.createAppointment(reqMock, resMock)

            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(appointmentReq.identificacionPaciente);
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(appointmentReq.id_doctor);
            expect(resMock.json).toHaveBeenCalledWith({"message": customError.message});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
        it('should be handler error from service and return 400', async () => {
            const appointmentReq: AppointmentReq = {
                identificacionPaciente: "123",
                especialidad: "Medicina general",
                id_doctor: "3",
                horario: "Lunes 17/07/2023 8:00am",
            }; 

            const createError = new CreateError('appointment', 'appointmentService', '');

            (reqMock.body as AppointmentReq) = appointmentReq;

            (patientService.getPatientByIdentificacion as jest.Mock).mockResolvedValue(patient);
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            (appointmentService.createAppointment as jest.Mock).mockRejectedValue(createError);
            await appointmentController.createAppointment(reqMock, resMock)

            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(appointmentReq.identificacionPaciente);
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(appointmentReq.id_doctor);
            expect(appointmentService.createAppointment).toHaveBeenCalledWith(patient, doctor, appointmentReq);
            expect(resMock.json).toHaveBeenCalledWith({"message": createError.message});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
    })

    describe('getAppointmentByID', () => {
        it('should be get an appointment  by id and return info', async () => {
            const id_cita = "1";
            (reqMock.params) = {id: id_cita};

            const appointmentRes: AppointmentRes = {
                identificacionPaciente: patient.identificacion,
                doctor: `${doctor.nombre} ${doctor.apellido}`,
                especialidad: doctor.especialidad,
                horario: appointment1.horario,
                consultorio: doctor.consultorio,
            };

            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(appointment1);
            (patientService.getPatientById as jest.Mock).mockResolvedValue(patient);
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            await appointmentController.getAppointmentById(reqMock, resMock)

            expect(patientService.getPatientById).toHaveBeenCalledWith(appointment1.id_paciente);
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(appointment1.id_doctor);
            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(parseInt(id_cita));
            expect(resMock.json).toHaveBeenCalledWith(appointmentRes);
            expect(resMock.status).toHaveBeenCalledWith(200);
        })
        it('should be handler error and return 400 when param id is wrong', async () => {
            const id_cita = "m";
            (reqMock.params) = {id: id_cita};

            await appointmentController.getAppointmentById(reqMock, resMock)

            expect(resMock.json).toHaveBeenCalledWith({message: `Error: ID must be a number`});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
        it('should be handler error from service and return 400', async () => {
            const id_cita = "1";
            (reqMock.params) = {id: id_cita};
            const getError = new GetError('appointment', 'appointmetnService', '');
            (appointmentService.getAppointmentById as jest.Mock).mockRejectedValue(getError);
            await appointmentController.getAppointmentById(reqMock, resMock)

            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(parseInt(id_cita));
            expect(resMock.json).toHaveBeenCalledWith({message: getError.message});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
        it('should be return 400 when patient doesnt exist', async () => {
            const id_cita = "1";
            (reqMock.params) = {id: id_cita};
            const recordError = new RecordNotFoundError('Patient');
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(appointment1);
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            (patientService.getPatientById as jest.Mock).mockRejectedValue(recordError);
            await appointmentController.getAppointmentById(reqMock, resMock)

            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(parseInt(id_cita));
            expect(patientService.getPatientById).toHaveBeenCalledWith(appointment1.id_paciente);
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(appointment1.id_doctor);
            expect(resMock.json).toHaveBeenCalledWith({message: recordError.message});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
        it('should be return 400 when doctor doesnt exist', async () => {
            const id_cita = "1";
            (reqMock.params) = {id: id_cita};
            const recordError = new RecordNotFoundError('Doctor');
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(appointment1);
            (doctorService.getDoctorById as jest.Mock).mockRejectedValue(recordError);
            await appointmentController.getAppointmentById(reqMock, resMock)

            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(parseInt(id_cita));
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(appointment1.id_doctor);
            expect(resMock.json).toHaveBeenCalledWith({message: recordError.message});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
    })

    describe('getAppointmentByPatient', () => {
        const identificationReq = { "identificacion": "123456"};
        it('should get appointments by patients identification', async () => {
            (reqMock.body as any) = identificationReq;
            (patientService.getPatientByIdentificacion as jest.Mock).mockResolvedValue(patient);
            (appointmentService.getAppointmentsByPatient as jest.Mock).mockResolvedValue([appointment1]);
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            
            await appointmentController.getAppointmentByPatient(reqMock, resMock)
            
            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(identificationReq.identificacion);
            expect(appointmentService.getAppointmentsByPatient).toHaveBeenCalledWith(patient.id_paciente);
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(doctor.id_doctor);
            const appointmentsPatient = [{
                doctor: `${doctor.nombre} ${doctor.apellido}`,
                especialidad: doctor.especialidad,
                horario: appointment1.horario,
                consultorio: doctor.consultorio,
            }];
            expect(resMock.json).toHaveBeenCalledWith(appointmentsPatient);
            expect(resMock.status).toHaveBeenCalledWith(201);
        })
        it('should return 400 when body params is wrong', async () => {
            const wrongReq = { "identificacioon": "123456"};
            (reqMock.body as any) = wrongReq;
            await appointmentController.getAppointmentByPatient(reqMock, resMock)
            expect(resMock.json).toHaveBeenCalledWith({"message": "\"identificacion\" is required"});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
        it('should return 400 when patient doesnt exist', async () => {
            (reqMock.body as any) = identificationReq;
            const recordError = new RecordNotFoundError('Patient');
            (patientService.getPatientByIdentificacion as jest.Mock).mockRejectedValue(recordError);
            
            await appointmentController.getAppointmentByPatient(reqMock, resMock)
            
            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(identificationReq.identificacion);
            expect(resMock.json).toHaveBeenCalledWith({message: recordError.message});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
        it('should be handler error from appointment service and return 400', async () => {
            (reqMock.body as any) = identificationReq;
            const getError = new GetError('appointment', 'appointmentService', '');
            (patientService.getPatientByIdentificacion as jest.Mock).mockResolvedValue(patient);
            (appointmentService.getAppointmentsByPatient as jest.Mock).mockRejectedValue(getError);
            
            await appointmentController.getAppointmentByPatient(reqMock, resMock)
            
            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(identificationReq.identificacion);
            expect(appointmentService.getAppointmentsByPatient).toHaveBeenCalledWith(patient.id_paciente);
            expect(resMock.json).toHaveBeenCalledWith({message: getError.message});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
    })

    describe('deleteAppointmentByID', () => {
        const id_cita = "1";
        it('should delete an appointment by id', async () => {
            (reqMock.params) = {id: id_cita};
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(appointment1);
            (appointmentService.deleteAppointmentById as jest.Mock).mockResolvedValue(appointment1);
            await appointmentController.deleteAppointmentById(reqMock, resMock)
            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(parseInt(id_cita));
            expect(appointmentService.deleteAppointmentById).toHaveBeenCalledWith(appointment1.id_cita);
            expect(resMock.json).toHaveBeenCalledWith({message: "Appointment deleted succesfully"});
            expect(resMock.status).toHaveBeenCalledWith(200);
        })
        it('should be handler error from appointment service and return 400', async () => {
            (reqMock.params) = {id: id_cita};
            const deleteError = new DeleteError('appointment', 'appointmentService', '');
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(appointment1);
            (appointmentService.deleteAppointmentById as jest.Mock).mockRejectedValue(deleteError);
            await appointmentController.deleteAppointmentById(reqMock, resMock)
            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(parseInt(id_cita));
            expect(appointmentService.deleteAppointmentById).toHaveBeenCalledWith(appointment1.id_cita);
            expect(resMock.json).toHaveBeenCalledWith({message: deleteError.message});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })
    })
})