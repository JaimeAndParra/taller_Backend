import { Request, Response } from "express";
import { PatientService } from "../api/components/pacientes/service";
import { PatientController, PatientControllerImpl } from "../api/components/pacientes/controller";
import { Patient } from "../api/components/pacientes/model";

const reqMock = {} as Request;
const resMock = {} as Response;

describe('PatientController', () => {
    let patientService: PatientService;
    let patientController: PatientController;
    let nowDate: Date;
    let patient1: Patient;
    let patient2: Patient;
    let patients: Patient[];

    beforeEach(() => {
        patientService = {
            getAllPatients: jest.fn(),
            createPatient: jest.fn(),
            getPatientById: jest.fn(),
            updatePatientById: jest.fn(),
            deletePatientById: jest.fn(),
            getPatientByIdentificacion: jest.fn()
        },
        patientController = new PatientControllerImpl(patientService);
        resMock.status = jest.fn().mockReturnThis();
        resMock.json = jest.fn().mockReturnThis();
        nowDate = new Date();
        patient1 = {
            id_paciente: 1,
            nombre: "Angela",
            apellido: "Nicols",
            identificacion: "123",
            telefono: "666-666-66",            
            updated_at: nowDate,
            created_at: nowDate
        };
        patient1 = {
            id_paciente: 2,
            nombre: "Oliver",
            apellido: "Brown",
            identificacion: "321",
            telefono: "777-777-77",            
            updated_at: nowDate,
            created_at: nowDate
        };
        patients = [patient1, patient2];
    })

    describe('getAllPatients', () => {
        it('should be get all patients', async () => {
            (patientService.getAllPatients as jest.Mock).mockResolvedValue(patients);
            await patientController.getAllPatients(reqMock, resMock)
            expect(patientService.getAllPatients).toHaveBeenCalled()
            expect(resMock.json).toHaveBeenCalledWith(patients)
            expect(resMock.status).toHaveBeenCalledWith(200) 
        })
        it('should be handler error and return 400 status', async () => {
            const error = new Error('Database Error');
            (patientService.getAllPatients as jest.Mock).mockRejectedValue(error);
            await patientController.getAllPatients(reqMock, resMock)

            expect(patientService.getAllPatients).toHaveBeenCalled()
            expect(resMock.json).toHaveBeenCalledWith({message: "Database Error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })

    })

    describe('createPatient', () => {
        it('should create a new patient and return info', async () => {
            const patientReq = {
                nombre: patient1.nombre,
                apellido: patient1.apellido,
                identificacion: patient1.identificacion,
                telefono: patient1.telefono
            };
            
            (reqMock.body as any) = patientReq;

            (patientService.createPatient as jest.Mock).mockResolvedValue(patient1)
            await patientController.createPatient(reqMock, resMock)
            
            expect(patientService.createPatient).toHaveBeenCalledWith(patientReq)
            expect(resMock.json).toHaveBeenCalledWith(patient1) 
            expect(resMock.status).toHaveBeenCalledWith(201)   
        })
        it('should be handler error and return 400 when body request is wrong', async () => {
            const patientReq = {
                apellido: patient1.apellido,
                identificacion: patient1.identificacion,
                telefono: patient1.telefono
            };        
            (reqMock.body as any) = patientReq;
            await patientController.createPatient(reqMock, resMock)
            expect(resMock.json).toHaveBeenCalledWith({"message": "\"nombre\" is required"}) 
            expect(resMock.status).toHaveBeenCalledWith(400)  

        })
        it('should be handler error from service and return 400 status', async () => {
            const error = new Error('Database Error');
            const patientReq = {
                nombre: patient1.nombre,
                apellido: patient1.apellido,
                identificacion: patient1.identificacion,
                telefono: patient1.telefono
            };  
            (reqMock.body as any) = patientReq;
            (patientService.createPatient as jest.Mock).mockRejectedValue(error);
            await patientController.createPatient(reqMock, resMock)

            expect(patientService.createPatient).toHaveBeenCalledWith(patientReq);
            expect(resMock.json).toHaveBeenCalledWith({message: "Database Error"});
            expect(resMock.status).toHaveBeenCalledWith(400);
        })

    })
    
    describe('getPatientByID', () => {
        it('should return a patient by id', async () => {
            (reqMock.params) = {id: "1"};
            (patientService.getPatientById as jest.Mock).mockResolvedValue(patient1)
            await patientController.getPatientById(reqMock, resMock)
            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(resMock.json).toHaveBeenCalledWith(patient1)   
            expect(resMock.status).toHaveBeenCalledWith(200) 
        })
        it('should be handler error and return 400 when param id is wrong', async () => {
            (reqMock.params) = {id: "m"};
            await patientController.getPatientById(reqMock, resMock)
            expect(resMock.json).toHaveBeenCalledWith({message: `Error: ID must be a number`})   
            expect(resMock.status).toHaveBeenCalledWith(400) 
        })
        it('should be handler error from service and return 400 status', async () => {
            const error = new Error("Internal Server error");
            (reqMock.params) = {id: "1"};

            (patientService.getPatientById as jest.Mock).mockRejectedValue(error);
            await patientController.getPatientById(reqMock, resMock)

            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(resMock.json).toHaveBeenCalledWith({message: "Internal Server error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getPatientByIdentificacion', () => {
        it('should return a patient by identificacion', async () => {
            const identificacion = patient1.identificacion;
            (reqMock.body as any) = {"identificacion": identificacion};
            (patientService.getPatientByIdentificacion as jest.Mock).mockResolvedValue(patient1)
            await patientController.getPatientByIdentificacion(reqMock, resMock)
            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(identificacion)
            expect(resMock.json).toHaveBeenCalledWith(patient1)
            expect(resMock.status).toHaveBeenCalledWith(200) 
        })
        it('should be handler error and return 400 when body request is wrong', async () => {
            const req = {
                identificacioon: patient1.identificacion
            };
            (reqMock.body as any) = req;
            await patientController.getPatientByIdentificacion(reqMock, resMock)

            expect(resMock.json).toHaveBeenCalledWith({"message": "\"identificacion\" is required"}) 
            expect(resMock.status).toHaveBeenCalledWith(400)  

        })
        it('should be handler error from service and return 400 status', async () => {
            const error = new Error("Internal Server error");
            const req = {
                identificacion: patient1.identificacion
            };
            (reqMock.body as any) = req;

            (patientService.getPatientByIdentificacion as jest.Mock).mockRejectedValue(error);
            await patientController.getPatientByIdentificacion(reqMock, resMock)

            expect(patientService.getPatientByIdentificacion).toHaveBeenCalledWith(req.identificacion)
            expect(resMock.json).toHaveBeenCalledWith({message: "Internal Server error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })

    describe('update Patient by Id', () => {
        it('should update a patient and return the modification', async () => {
            const updates = {nombre: "Maria"};
            (reqMock.params as any) = {id: "1"};
            (reqMock.body as any) = updates;
            const patientUpdate = {...patient1, ...updates};

            (patientService.getPatientById as jest.Mock).mockResolvedValue(patient1);
            (patientService.updatePatientById as jest.Mock).mockResolvedValue(patient1);
            await patientController.updatePatientById(reqMock, resMock);
            expect(patientService.getPatientById).toHaveBeenCalledWith(1);
            expect(patientService.updatePatientById).toHaveBeenCalledWith(patient1, updates);
            expect(resMock.json).toHaveBeenCalledWith(patient1);
            expect(resMock.status).toHaveBeenCalledWith(200);
        })
        it('should be handler error and return 400 when param id is wrong', async () => {
            (reqMock.params) = {id: "m"};
            await patientController.updatePatientById(reqMock, resMock)
            expect(resMock.json).toHaveBeenCalledWith({message: `Error: ID must be a number`})   
            expect(resMock.status).toHaveBeenCalledWith(400) 
        })
        it('should be handler error from service and return 400 status', async () => {
            const error = new Error("Internal Server error");
            (reqMock.params) = {id: "1"};

            (patientService.getPatientById as jest.Mock).mockRejectedValue(error);
            await patientController.updatePatientById(reqMock, resMock)

            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(resMock.json).toHaveBeenCalledWith({message: "Internal Server error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })
       
    describe('deleteDoctorByID', () => {
        it('should delete a doctor by id and return it', async () => {
            (reqMock.params) = {id: "1"};
            (patientService.getPatientById as jest.Mock).mockResolvedValue(patient1);
            (patientService.deletePatientById as jest.Mock).mockResolvedValue(patient1);
            
            await patientController.deletePatientById(reqMock, resMock);
            expect(patientService.getPatientById).toHaveBeenCalledWith(1);
            expect(patientService.deletePatientById).toHaveBeenCalledWith(patient1);
            expect(resMock.json).toHaveBeenCalledWith({message: `Patient ${patient1.nombre} ${patient1.apellido} deleted succesfully`});
            expect(resMock.status).toHaveBeenCalledWith(200);
        })
        it('should be handler error and return 400 when param id is wrong', async () => {
            (reqMock.params) = {id: "m"};
            await patientController.deletePatientById(reqMock, resMock)
            expect(resMock.json).toHaveBeenCalledWith({message: `Error: ID must be a number`})   
            expect(resMock.status).toHaveBeenCalledWith(400) 
        })
        it('should be handler error from service and return 400 status', async () => {
            const error = new Error("Internal Server error");
            (reqMock.params) = {id: "1"};

            (patientService.getPatientById as jest.Mock).mockRejectedValue(error);
            await patientController.deletePatientById(reqMock, resMock)

            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(resMock.json).toHaveBeenCalledWith({message: "Internal Server error"})
            expect(resMock.status).toHaveBeenCalledWith(400)
        })
    })

})