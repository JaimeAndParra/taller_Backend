import { Request, Response } from "express";
import { DoctorController, DoctorControllerImpl } from "../api/components/doctores/controller";
import { DoctorService } from "../api/components/doctores/service";
import { Doctor, DoctorReq } from "../api/components/doctores/model";

const reqMock = {} as Request;
const resMock = {} as Response;

describe('DoctorController', () => {
    let doctorService: DoctorService;
    let doctorController: DoctorController;

    /* El mock emula el comportamiento del Service */

    beforeEach(() => {
        doctorService = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctorById: jest.fn(),
            deleteDoctorById: jest.fn()
        },
        doctorController = new DoctorControllerImpl(doctorService)
        /* Valores que retorna el mock */
        resMock.status = jest.fn().mockReturnThis();
        resMock.json = jest.fn().mockReturnThis();
    })

    describe('getAllDoctors', () => {
        it('should be get all doctors', async () => {
            const doctors: Doctor[] = [
                {id_doctor:1, nombre:"Carlos", apellido:"Caceres", especialidad:"Medicina General", consultorio:"100", correo:"carcec@gmail.com"},
                {id_doctor:2, nombre:"Jaime", apellido:"Parra", especialidad:"Ortopedia", consultorio:"101", correo:"jaipar@gmail.com"},
            ];

            /* Cuando se llame getAllDoctors, se mockea y se retorna doctors */
            (doctorService.getAllDoctors as jest.Mock).mockResolvedValue(doctors)

            /* Hace el llamado a getAllDoctors */
            await doctorController.getAllDoctors(reqMock, resMock)

            /* Valores esperados */
            expect(doctorService.getAllDoctors).toHaveBeenCalled()  /* Debe ser llamado 1 sola vez */
            expect(resMock.json).toHaveBeenCalledWith(doctors)      /* El json que debe retornar es doctores */
            expect(resMock.status).toHaveBeenCalledWith(200)        /* El status que debe retornar es 200 */
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Database Error');
            (doctorService.getAllDoctors as jest.Mock).mockRejectedValue(error);
            await doctorController.getAllDoctors(reqMock, resMock)

            expect(doctorService.getAllDoctors).toHaveBeenCalled()
            expect(resMock.json).toHaveBeenCalledWith({message: "Database Error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })

    })

    describe('createDoctor', () => {
        it('should create a new doctor return info', async () => {
            const doctorRes: Doctor = {id_doctor:1, nombre:"Carlos", apellido:"Caceres", especialidad:"Medicina General", consultorio:"100", correo:"carcec@gmail.com"};
            const doctorReq: DoctorReq = {nombre:"Carlos", apellido:"Caceres", especialidad:"Medicina General", consultorio:"100", correo:"carcec@gmail.com"};

            (reqMock.body as DoctorReq) = doctorReq;

            (doctorService.createDoctor as jest.Mock).mockResolvedValue(doctorRes)

            /* Hace el llamado a getAllDoctors */
            await doctorController.createDoctor(reqMock, resMock)

            /* Valores esperados */
            expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)  /* Debe ser llamado 1 sola vez */
            expect(resMock.json).toHaveBeenCalledWith(doctorRes)      /* El json que debe retornar es doctores */
            expect(resMock.status).toHaveBeenCalledWith(201)        /* El status que debe retornar es 200 */
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Database Error');
            (reqMock.body) = {};
            (doctorService.createDoctor as jest.Mock).mockRejectedValue(error);
            await doctorController.createDoctor(reqMock, resMock)

            expect(doctorService.createDoctor).toHaveBeenCalledWith({})
            expect(resMock.json).toHaveBeenCalledWith({message: "Database Error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })
    describe('getDoctorByID', () => {
        it('should return a doctor by id', async () => {

            (reqMock.params) = {id: "1"};
            const doctor: Doctor = {id_doctor:1, nombre:"Carlos", apellido:"Caceres", especialidad:"Medicina General", consultorio:"100", correo:"carcec@gmail.com"};

            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor)

            /* Hace el llamado a getAllDoctors */
            await doctorController.getDoctorById(reqMock, resMock)

            /* Valores esperados */
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)  /* Debe ser llamado 1 sola vez */
            expect(resMock.json).toHaveBeenCalledWith(doctor)      /* El json que debe retornar es doctores */
            expect(resMock.status).toHaveBeenCalledWith(200)        /* El status que debe retornar es 200 */
        })

        it('should return an 400 if an error exist', async () => {
            const error = new Error("Internal Server error");
            (reqMock.params) = {id: "1"};

            (doctorService.getDoctorById as jest.Mock).mockRejectedValue(error);
            await doctorController.getDoctorById(reqMock, resMock)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(resMock.json).toHaveBeenCalledWith({message: "Internal Server error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })


})