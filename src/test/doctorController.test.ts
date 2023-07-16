import { Request, Response } from "express";
import { DoctorController, DoctorControllerImpl } from "../api/components/doctores/controller";
import { DoctorService } from "../api/components/doctores/service";
import { Doctor } from "../api/components/doctores/model";

const reqMock = {} as Request;
const resMock = {} as Response;

describe('DoctorController', () => {
    let doctorService: DoctorService;
    let doctorController: DoctorController;
    let nowDate: Date;
    let doctor1: Doctor;
    let doctor2: Doctor;
    let doctores: Doctor[];

    beforeEach(() => {
        doctorService = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctorById: jest.fn(),
            deleteDoctorById: jest.fn(),
            getDoctorByIdentificacion: jest.fn()
        },
        doctorController = new DoctorControllerImpl(doctorService)
        resMock.status = jest.fn().mockReturnThis();
        resMock.json = jest.fn().mockReturnThis();
        nowDate = new Date();
        doctor1 = {
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
        doctor2 = {
            id_doctor: 2,
            nombre: "Maria",
            apellido: "Williams",
            identificacion: "321",
            especialidad: "Odontología",
            consultorio: "200",
            correo: "maria.williams@gmail.com",
            updated_at: nowDate,
            created_at: nowDate
        },
        doctores = [doctor1, doctor2];
    })

    describe('getAllDoctors', () => {
        it('should be get all doctors', async () => {
            (doctorService.getAllDoctors as jest.Mock).mockResolvedValue(doctores)
            await doctorController.getAllDoctors(reqMock, resMock)
            expect(doctorService.getAllDoctors).toHaveBeenCalled()
            expect(resMock.json).toHaveBeenCalledWith(doctores)
            expect(resMock.status).toHaveBeenCalledWith(200) 
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
            const doctorReq = {
                nombre: doctor1.nombre,
                apellido: doctor1.apellido,
                especialidad: doctor1.especialidad,
                consultorio: parseInt(doctor1.consultorio),
                correo: doctor1.correo,
                identificacion: doctor1.identificacion,
            };
            
            (reqMock.body as any) = doctorReq;

            (doctorService.createDoctor as jest.Mock).mockResolvedValue(doctor1)
            await doctorController.createDoctor(reqMock, resMock)
            
            expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(resMock.json).toHaveBeenCalledWith(doctor1) 
            expect(resMock.status).toHaveBeenCalledWith(201)   
        })
        it('should be handler error and return 400 when body request is wrong', async () => {
            const doctorReq = {
                apellido: doctor1.apellido,
                especialidad: doctor1.especialidad,
                consultorio: parseInt(doctor1.consultorio),
                correo: doctor1.correo,
                identificacion: doctor1.identificacion,
            };
            
            (reqMock.body as any) = doctorReq;

            await doctorController.createDoctor(reqMock, resMock)
            
            expect(resMock.json).toHaveBeenCalledWith({"message": "\"nombre\" is required"}) 
            expect(resMock.status).toHaveBeenCalledWith(400)  

        })
        it('should be handler error and return 400 status', async () => {
            const error = new Error('Database Error');
            const doctorReq = {
                nombre: doctor1.nombre,
                apellido: doctor1.apellido,
                especialidad: doctor1.especialidad,
                consultorio: parseInt(doctor1.consultorio),
                correo: doctor1.correo,
                identificacion: doctor1.identificacion,
            };
            (reqMock.body as any) = doctorReq;
            (doctorService.createDoctor as jest.Mock).mockRejectedValue(error);
            await doctorController.createDoctor(reqMock, resMock)

            expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(resMock.json).toHaveBeenCalledWith({message: "Database Error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })

    })
    
    describe('getDoctorByID', () => {
        it('should return a doctor by id', async () => {
            (reqMock.params) = {id: "1"};
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor1)
            await doctorController.getDoctorById(reqMock, resMock)
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(resMock.json).toHaveBeenCalledWith(doctor1)   
            expect(resMock.status).toHaveBeenCalledWith(200) 
        })
        it('should be handler error and return 400 when param id is wrong', async () => {
            (reqMock.params) = {id: "m"};
            await doctorController.getDoctorById(reqMock, resMock)
            expect(resMock.json).toHaveBeenCalledWith({message: `Error: ID must be a number`})   
            expect(resMock.status).toHaveBeenCalledWith(400) 
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

    describe('getDoctorByIdentificacion', () => {
        it('should return a doctor by identificacion', async () => {
            const identificacion = doctor1.identificacion;
            (reqMock.body as any) = {"identificacion": identificacion};
            (doctorService.getDoctorByIdentificacion as jest.Mock).mockResolvedValue(doctor1)
            await doctorController.getDoctorByIdentificacion(reqMock, resMock)
            expect(doctorService.getDoctorByIdentificacion).toHaveBeenCalledWith(identificacion)
            expect(resMock.json).toHaveBeenCalledWith(doctor1)
            expect(resMock.status).toHaveBeenCalledWith(200) 
        })
        it('should be handler error and return 400 when body request is wrong', async () => {
            const req = {
                identificacioon: doctor1.identificacion
            };
            (reqMock.body as any) = req;
            await doctorController.getDoctorByIdentificacion(reqMock, resMock)

            expect(resMock.json).toHaveBeenCalledWith({"message": "\"identificacion\" is required"}) 
            expect(resMock.status).toHaveBeenCalledWith(400)  

        })
        it('should return an 400 if an error exist', async () => {
            const error = new Error("Internal Server error");
            const req = {
                identificacion: doctor1.identificacion
            };
            (reqMock.body as any) = req;

            (doctorService.getDoctorByIdentificacion as jest.Mock).mockRejectedValue(error);
            await doctorController.getDoctorByIdentificacion(reqMock, resMock)

            expect(doctorService.getDoctorByIdentificacion).toHaveBeenCalledWith(req.identificacion)
            expect(resMock.json).toHaveBeenCalledWith({message: "Internal Server error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })

    describe('updateDoctor by Id', () => {
        it('should update a doctor and return the modification', async () => {
            const updates = {nombre: "Pepito"};
            (reqMock.params as any) = {id: "1"};
            (reqMock.body as any) = updates;
            const doctorUpdate = {...doctor1, ...updates};

            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor1);
            (doctorService.updateDoctorById as jest.Mock).mockResolvedValue(doctor1);
            await doctorController.updateDoctorById(reqMock, resMock);
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1);
            expect(doctorService.updateDoctorById).toHaveBeenCalledWith(doctor1, updates);
            expect(resMock.json).toHaveBeenCalledWith(doctor1);
            expect(resMock.status).toHaveBeenCalledWith(200);
        })
        it('should be handler error and return 400 when param id is wrong', async () => {
            (reqMock.params) = {id: "m"};
            await doctorController.updateDoctorById(reqMock, resMock)
            expect(resMock.json).toHaveBeenCalledWith({message: `Error: ID must be a number`})   
            expect(resMock.status).toHaveBeenCalledWith(400) 
        })
        it('should return an 400 if an error exist', async () => {
            const error = new Error("Internal Server error");
            (reqMock.params) = {id: "1"};

            (doctorService.getDoctorById as jest.Mock).mockRejectedValue(error);
            await doctorController.updateDoctorById(reqMock, resMock)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(resMock.json).toHaveBeenCalledWith({message: "Internal Server error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })

    describe('deleteDoctorByID', () => {
        it('should delete a doctor by id and return it', async () => {
            (reqMock.params) = {id: "1"};
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctor1);
            (doctorService.deleteDoctorById as jest.Mock).mockResolvedValue(doctor1);
            
            await doctorController.deleteDoctorById(reqMock, resMock);
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1);
            expect(doctorService.deleteDoctorById).toHaveBeenCalledWith(doctor1);
            expect(resMock.json).toHaveBeenCalledWith({message: `Doctor ${doctor1.apellido} deleted succesfully.`});
            expect(resMock.status).toHaveBeenCalledWith(200);
        })
        it('should be handler error and return 400 when param id is wrong', async () => {
            (reqMock.params) = {id: "m"};
            await doctorController.deleteDoctorById(reqMock, resMock)
            expect(resMock.json).toHaveBeenCalledWith({message: `Error: ID must be a number`})   
            expect(resMock.status).toHaveBeenCalledWith(400) 
        })
        it('should return an 400 if an error exist', async () => {
            const error = new Error("Internal Server error");
            (reqMock.params) = {id: "1"};

            (doctorService.getDoctorById as jest.Mock).mockRejectedValue(error);
            await doctorController.deleteDoctorById(reqMock, resMock)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(resMock.json).toHaveBeenCalledWith({message: "Internal Server error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })

})