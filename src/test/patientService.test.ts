import { Patient, PatientReq } from "../api/components/pacientes/model";
import { PatientRepository } from "../api/components/pacientes/repository";
import { PatientService, PatientServiceImpl } from "../api/components/pacientes/service";
import { CreateError, DeleteError, GetAllError, GetError, RecordAlreadyExistsError, RecordNotFoundError, UpdateError } from "../utils/customError";


describe('PatientService', () => {
    let patientService: PatientService;
    let patientRepository: PatientRepository;
    let nowDate: Date;
    let patient1: Patient;
    let patient2: Patient;
    let patients: Patient[];

    beforeEach(() => {
        patientRepository = {
            getAllPatients: jest.fn(),
            createPatient: jest.fn(),
            getPatientById: jest.fn(),
            updatePatientById: jest.fn(),
            deletePatientById: jest.fn(),
            getPatientByIdentificacion: jest.fn()
        },
        patientService = new PatientServiceImpl(patientRepository);
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
        patient2 = {
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
            (patientRepository.getAllPatients as jest.Mock).mockResolvedValue(patients);
            const result = await patientService.getAllPatients();
            expect(patientRepository.getAllPatients).toHaveBeenCalled();
            expect(result).toEqual(patients);
        })
        it('should return an empty array when there are not patients', async () => {
            const patientsEmpty: Patient[] = [];
            (patientRepository.getAllPatients as jest.Mock).mockResolvedValue(patientsEmpty);
            const result = await patientService.getAllPatients();
            expect(patientRepository.getAllPatients).toHaveBeenCalled();
            expect(result).toEqual([]);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const getAllError = new GetAllError('patient', 'patientRepository', "");
            (patientRepository.getAllPatients as jest.Mock).mockRejectedValue(getAllError);
            await patientService.getAllPatients()
            .catch((error)=>{
                expect(error).toEqual(getAllError)
            })
            expect(patientRepository.getAllPatients).toHaveBeenCalled();
        })
    })

    describe('create Patient', () => {
        it('should create a new patient and return it', async () => {
            const patientReq = {
                nombre: patient1.nombre,
                apellido: patient1.apellido,
                identificacion: patient1.identificacion,
                telefono: patient1.telefono
            };

            (patientRepository.getPatientByIdentificacion as jest.Mock).mockResolvedValue(undefined);
            (patientRepository.createPatient as jest.Mock).mockResolvedValue(patient1);
            const result = await patientService.createPatient(patientReq);
            expect(patientRepository.getPatientByIdentificacion).toHaveBeenCalledWith(patientReq.identificacion);
            expect(result).toEqual(patient1);
        })
        it('should throw an error if patient exist', async () => {
            const patientReq = {
                nombre: patient1.nombre,
                apellido: patient1.apellido,
                identificacion: patient1.identificacion,
                telefono: patient1.telefono
            };
            const recordError = new RecordAlreadyExistsError("Patient");
            (patientRepository.getPatientByIdentificacion as jest.Mock).mockResolvedValue(patient1);
            await patientService.createPatient(patientReq)
            .catch((error)=>{
                expect(error).toEqual(recordError)
            })
            expect(patientRepository.getPatientByIdentificacion).toHaveBeenCalledWith(patientReq.identificacion);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const patientReq = {
                nombre: patient1.nombre,
                apellido: patient1.apellido,
                identificacion: patient1.identificacion,
                telefono: patient1.telefono
            };
            const createError = new CreateError('patient', 'patientRepository', "");
            (patientRepository.createPatient as jest.Mock).mockRejectedValue(createError);
            await patientService.createPatient(patientReq)
            .catch((error)=>{
                expect(error).toEqual(createError)
            })
            expect(patientRepository.getPatientByIdentificacion).toHaveBeenCalledWith(patientReq.identificacion);
        })
    })

    describe('getPatientByID', () => {
        it('should get patient By ID', async () => {
            const id: number = patient1.id_paciente;
            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(patient1);
            const result = await patientService.getPatientById(id)
            
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(id);
            expect(result).toEqual(patient1);
        })
        it('should return a RecordNotFoundError when no patient found', async () => {
            const recordError = new RecordNotFoundError("Patient")
            const id: number = patient1.id_paciente;
            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(undefined);
            await patientService.getPatientById(id)
            .catch((error)=>{
                expect(error).toEqual(recordError)
            })
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(id);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const getError = new GetError("patient", "patientRepository", "");
            const id: number = patient1.id_paciente;
            (patientRepository.getPatientById as jest.Mock).mockRejectedValue(getError);
            await patientService.getPatientById(id)
            .catch((error)=>{
                expect(error).toEqual(getError);
            })
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(id);
        })
    })

    describe('getPatientByIdentification', () => {
        it('should get patient by identification', async () => {
            const identificacion: string = patient1.identificacion;
            (patientRepository.getPatientByIdentificacion as jest.Mock).mockResolvedValue(patient1);
            const result = await patientService.getPatientByIdentificacion(identificacion)
            
            expect(patientRepository.getPatientByIdentificacion).toHaveBeenCalledWith(identificacion);
            expect(result).toEqual(patient1);
        })
        it('should return a RecordNotFoundError when no patient found', async () => {
            const identificacion: string = "3";
            const recordError = new RecordNotFoundError("Patient");
            (patientRepository.getPatientByIdentificacion as jest.Mock).mockResolvedValue([]);
            await patientService.getPatientByIdentificacion(identificacion)
            .catch((error)=>{
                expect(error).toEqual(recordError)
            })
            expect(patientRepository.getPatientByIdentificacion).toHaveBeenCalledWith(identificacion);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const getError = new GetError("patient", "patientRepository", "");
            const identificacion: string = patient1.identificacion;
            (patientRepository.getPatientByIdentificacion as jest.Mock).mockRejectedValue(getError);
            await patientService.getPatientByIdentificacion(identificacion)
            .catch((error)=>{
                expect(error).toEqual(getError);
            })
            expect(patientRepository.getPatientByIdentificacion).toHaveBeenCalledWith(identificacion);
        })
    })

    describe('updatePatientByID', () => {
        it('should update patient with partial request and return a patient updated', async () => {
            const updates: Partial<PatientReq> ={
                nombre: "Pepito",
            };
            const updatePatient:Patient = {...patient1, ...updates};
            (patientRepository.updatePatientById as jest.Mock).mockResolvedValue(updatePatient);
            const result = await patientService.updatePatientById(patient1, updates); 
            expect(result).toEqual(updatePatient);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const updates: Partial<PatientReq> ={
                nombre: "Pepito",
            };
            const updateError = new UpdateError('patient', 'DoctorRepository', '');
            (patientRepository.updatePatientById as jest.Mock).mockRejectedValue(updateError);
            await patientService.updatePatientById(patient1, updates)
            .catch((error)=>{
                expect(error).toEqual(updateError);
            })
        })
    })

    describe('deletePatientByID', () => {
        it('should delete patient by id and return a patient deleted', async () => {
            await patientService.deletePatientById(patient1)
            .then((patientDeleted)=>{
                expect(patientDeleted).toEqual(patient1);
            }) 
            expect(patientRepository.deletePatientById).toHaveBeenCalledWith(patient1.id_paciente);
        })
    })
})
