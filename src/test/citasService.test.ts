import { date } from "joi";
import { Appointment, AppointmentDBInsert, AppointmentReq, AppointmentRes } from "../api/components/citas/model";
import { AppointmentRepository } from "../api/components/citas/repository";
import { AppointmentService, AppointmentServiceImpl } from "../api/components/citas/service";
import { Doctor } from "../api/components/doctores/model";
import { Patient } from "../api/components/pacientes/model";
import { CreateError, GetAllError, GetError, RecordNotFoundError } from "../utils/customError";

describe('PatientService', () => {
    let appointmentService: AppointmentService;
    let appointmentRepository: AppointmentRepository;
    let nowDate: Date;
    let appointment1: Appointment;
    let appointment2: Appointment;
    let appointments: Appointment[];
    let patient: Patient;
    let doctor: Doctor;

    beforeEach(() => {
        appointmentRepository = {
            createAppointment: jest.fn(),
            deleteAppointmentById: jest.fn(),
            getAllAppointment: jest.fn(),
            getAppoinmentsByPatient: jest.fn(),
            getAppointmentByDoctorId: jest.fn(),
            getAppointmentById: jest.fn(),
        },
        appointmentService = new AppointmentServiceImpl(appointmentRepository);
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
            (appointmentRepository.getAllAppointment as jest.Mock).mockResolvedValue(appointments);
            const result = await appointmentService.getAllAppointment();
            expect(appointmentRepository.getAllAppointment).toHaveBeenCalled();
            expect(result).toEqual(appointments);
        })
        it('should return an empty array when there are not appointments', async () => {
            const appointmentEmpty: Appointment[] = [];
            (appointmentRepository.getAllAppointment as jest.Mock).mockResolvedValue(appointmentEmpty);
            const result = await appointmentService.getAllAppointment();
            expect(appointmentRepository.getAllAppointment).toHaveBeenCalled();
            expect(result).toEqual([]);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const getAllError = new GetAllError('appointment', 'appointmentRepository', "");
            (appointmentRepository.getAllAppointment as jest.Mock).mockRejectedValue(getAllError);
            await appointmentService.getAllAppointment()
            .catch((error)=>{
                expect(error).toEqual(getAllError)
            })
            expect(appointmentRepository.getAllAppointment).toHaveBeenCalled();
        })
    })

    describe('create Appointment', () => {
        it('should create a new appointment and return it', async () => {
            const appointmentReq: AppointmentReq = {
                identificacionPaciente: patient.identificacion,
                especialidad: doctor.especialidad,
                id_doctor: doctor.id_doctor.toString(),
                horario: appointment1.horario,
            };
            const appointmentRes: AppointmentRes = {
                identificacionPaciente: appointmentReq.identificacionPaciente,
                doctor: `${doctor.nombre} ${doctor.apellido}`,
                especialidad: doctor.especialidad,
                horario: appointmentReq.horario,
                consultorio: doctor.consultorio,
            };
            const result = await appointmentService.createAppointment(patient, doctor, appointmentReq);
            expect(result).toEqual(appointmentRes);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const appointmentReq: AppointmentReq = {
                identificacionPaciente: patient.identificacion,
                especialidad: doctor.especialidad,
                id_doctor: doctor.id_doctor.toString(),
                horario: appointment1.horario,
            };
            const createError = new CreateError('appointment', 'appointmentRepository', "");
            (appointmentRepository.createAppointment as jest.Mock).mockRejectedValue(createError);
            await appointmentService.createAppointment(patient, doctor, appointmentReq)
            .catch((error)=>{
                expect(error).toEqual(createError)
            })
        })
    })

    describe('getAppointmentByID', () => {
        it('should get appointment By ID', async () => {
            const id = appointment1.id_cita;
            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointment1);
            const result = await appointmentService.getAppointmentById(id)
            
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(id);
            expect(result).toEqual(appointment1);
        })
        it('should return a RecordNotFoundError when no appointment found', async () => {
            const id = appointment1.id_cita;
            const recordError = new RecordNotFoundError("Appointment");
            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(undefined);
            await appointmentService.getAppointmentById(id)
            .catch((error)=>{
                expect(error).toEqual(recordError)
            })
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(id);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const id = appointment1.id_cita;
            const getError = new GetError("appointment", "appointmentRepository", "");
            (appointmentRepository.getAppointmentById as jest.Mock).mockRejectedValue(getError);
            await appointmentService.getAppointmentById(id)
            .catch((error)=>{
                expect(error).toEqual(getError);
            })
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(id);
        })
    })

    describe('deleteAppointmentByID', () => {
        it('should delete appointment by id and return a appointment deleted', async () => {
            const id = appointment1.id_cita;
            (appointmentRepository.deleteAppointmentById as jest.Mock).mockResolvedValue(appointment1);
            await appointmentService.deleteAppointmentById(id)
            .then((appointmenteleted)=>{
                expect(appointmenteleted).toEqual(appointment1);
            }) 
            expect(appointmentRepository.deleteAppointmentById).toHaveBeenCalledWith(id);
        })
    })
})
