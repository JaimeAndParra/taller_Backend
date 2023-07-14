import { DoctorService, DoctorServiceImpl } from "../api/components/doctores/service";
import { Doctor, DoctorReq } from "../api/components/doctores/model";
import { DoctorRepository } from "../api/components/doctores/repository";
import { CreateError, GetAllError, GetError, RecordAlreadyExistsError, RecordNotFoundError, UpdateError } from "../utils/customError";


describe('DoctorService', () => {
    let doctorService: DoctorService;
    let doctorRespository: DoctorRepository;
    let nowDate: Date;
    let doctor1: Doctor;
    let doctor2: Doctor;
    let doctores: Doctor[];

    beforeEach(() => {
        doctorRespository = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctorById: jest.fn(),
            deleteDoctorById: jest.fn(),
            getDoctorByIdentificacion: jest.fn()
        },
        doctorService = new DoctorServiceImpl(doctorRespository)
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
            (doctorRespository.getAllDoctors as jest.Mock).mockResolvedValue(doctores);
            const result = await doctorService.getAllDoctors();
            expect(doctorRespository.getAllDoctors).toHaveBeenCalled();
            expect(result).toEqual(doctores);
        })
        it('should return an empty array when there are not doctors', async () => {
            const doctoresEmpty: Doctor[] = [];
            (doctorRespository.getAllDoctors as jest.Mock).mockResolvedValue(doctoresEmpty);
            const result = await doctorService.getAllDoctors();
            expect(doctorRespository.getAllDoctors).toHaveBeenCalled();
            expect(result).toEqual([]);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const getAllError = new GetAllError('doctor', 'doctorRepository', "");
            (doctorRespository.getAllDoctors as jest.Mock).mockRejectedValue(getAllError);
            await doctorService.getAllDoctors()
            .catch((error)=>{
                expect(error).toEqual(getAllError)
            })
            expect(doctorRespository.getAllDoctors).toHaveBeenCalled();
        })
    })

    describe('create Doctor', () => {
        it('should create a new doctor and return it', async () => {
            const doctorReq = {
                nombre: doctor1.nombre,
                apellido: doctor1.apellido,
                especialidad: doctor1.especialidad,
                consultorio: doctor1.consultorio,
                correo: doctor1.correo,
                identificacion: doctor1.identificacion,
            };

            (doctorRespository.getDoctorByIdentificacion as jest.Mock).mockResolvedValue([]);
            (doctorRespository.createDoctor as jest.Mock).mockResolvedValue(doctor1);
            const result = await doctorService.createDoctor(doctorReq);
            expect(doctorRespository.getDoctorByIdentificacion).toHaveBeenCalledWith(doctorReq.identificacion);
            expect(result).toEqual(doctor1);
        })
        it('should throw an error if doctor exist with same identification and different name', async () => {
            const doctorReq = {
                nombre: "Pepito",
                apellido: "Perez",
                especialidad: doctor1.especialidad,
                consultorio: doctor1.consultorio,
                correo: doctor1.correo,
                identificacion: doctor1.identificacion,
            };
            const recordError = new RecordAlreadyExistsError("Doctor");
            (doctorRespository.getDoctorByIdentificacion as jest.Mock).mockResolvedValue([doctor1]);
            await doctorService.createDoctor(doctorReq)
            .catch((error)=>{
                expect(error).toEqual(recordError)
            })
            expect(doctorRespository.getDoctorByIdentificacion).toHaveBeenCalledWith(doctorReq.identificacion);
        })
        it('should throw an error if doctor exist with same expecialidad', async () => {
            const doctorReq = {
                nombre: doctor1.nombre,
                apellido: doctor1.apellido,
                especialidad: doctor1.especialidad,
                consultorio: doctor1.consultorio,
                correo: doctor1.correo,
                identificacion: doctor1.identificacion,
            };
            const recordError = new RecordAlreadyExistsError("Doctor");
            (doctorRespository.getDoctorByIdentificacion as jest.Mock).mockResolvedValue([doctor1]);
            await doctorService.createDoctor(doctorReq)
            .catch((error)=>{
                expect(error).toEqual(recordError)
            })
            expect(doctorRespository.getDoctorByIdentificacion).toHaveBeenCalledWith(doctorReq.identificacion);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const doctorReq = {
                nombre: doctor1.nombre,
                apellido: doctor1.apellido,
                especialidad: doctor1.especialidad,
                consultorio: doctor1.consultorio,
                correo: doctor1.correo,
                identificacion: doctor1.identificacion,
            };
            const createError = new CreateError('doctor', 'doctorRepository', "");
            (doctorRespository.createDoctor as jest.Mock).mockRejectedValue(createError);
            await doctorService.createDoctor(doctorReq)
            .catch((error)=>{
                expect(error).toEqual(createError)
            })
            expect(doctorRespository.getDoctorByIdentificacion).toHaveBeenCalledWith(doctorReq.identificacion);
        })
    })

    describe('getDoctorById', () => {
        it('should get doctor By ID', async () => {
            const id: number = doctor1.id_doctor;
            (doctorRespository.getDoctorById as jest.Mock).mockResolvedValue(doctor1);
            const result = await doctorService.getDoctorById(id)
            
            expect(doctorRespository.getDoctorById).toHaveBeenCalledWith(id);
            expect(result).toEqual(doctor1);
        })
        it('should return a RecordNotFoundError when no doctor found', async () => {
            const recordError = new RecordNotFoundError("Doctor")
            const id: number = doctor1.id_doctor;
            (doctorRespository.getDoctorById as jest.Mock).mockResolvedValue(undefined);
            await doctorService.getDoctorById(id)
            .catch((error)=>{
                expect(error).toEqual(recordError)
            })
            expect(doctorRespository.getDoctorById).toHaveBeenCalledWith(id);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const getError = new GetError("doctor", "doctorRepository", "");
            const id: number = doctor1.id_doctor;
            (doctorRespository.getDoctorById as jest.Mock).mockRejectedValue(getError);
            await doctorService.getDoctorById(id)
            .catch((error)=>{
                expect(error).toEqual(getError);
            })
            expect(doctorRespository.getDoctorById).toHaveBeenCalledWith(id);
        })
    })

    describe('getDoctorByIdentification', () => {
        it('should get doctor by identification', async () => {
            const identificacion: string = doctor1.identificacion;
            (doctorRespository.getDoctorByIdentificacion as jest.Mock).mockResolvedValue([doctor1]);
            const result = await doctorService.getDoctorByIdentificacion(identificacion)
            
            expect(doctorRespository.getDoctorByIdentificacion).toHaveBeenCalledWith(identificacion);
            expect(result).toEqual([doctor1]);
        })
        it('should return a RecordNotFoundError when no doctor found', async () => {
            const identificacion: string = "3";
            const recordError = new RecordNotFoundError("Doctor");
            (doctorRespository.getDoctorByIdentificacion as jest.Mock).mockResolvedValue([]);
            await doctorService.getDoctorByIdentificacion(identificacion)
            .catch((error)=>{
                expect(error).toEqual(recordError)
            })
            expect(doctorRespository.getDoctorByIdentificacion).toHaveBeenCalledWith(identificacion);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const getError = new GetError("doctor", "doctorRepository", "");
            const identificacion: string = doctor1.identificacion;
            (doctorRespository.getDoctorByIdentificacion as jest.Mock).mockRejectedValue(getError);
            await doctorService.getDoctorByIdentificacion(identificacion)
            .catch((error)=>{
                expect(error).toEqual(getError);
            })
            expect(doctorRespository.getDoctorByIdentificacion).toHaveBeenCalledWith(identificacion);
        })
    })
    describe('updateDoctorById', () => {
        it('should update doctor with partial request and return a doctor updated', async () => {
            const updates: Partial<DoctorReq> ={
                nombre: "Pepito",
                consultorio: "120",
            };
            const updateDoctor:Doctor = {...doctor1, ...updates};
            (doctorRespository.updateDoctorById as jest.Mock).mockResolvedValue(updateDoctor);
            const result = await doctorService.updateDoctorById(doctor1, updates);
            
            expect(result).toEqual(updateDoctor);
        })
        it('should be handler error from Repository and throw to controller', async () => {
            const updates: Partial<DoctorReq> ={
                nombre: "Pepito",
                consultorio: "120",
            };
            const updateError = new UpdateError('doctor', 'DoctorRepository', '');
            (doctorRespository.updateDoctorById as jest.Mock).mockRejectedValue(updateError);
            await doctorService.updateDoctorById(doctor1, updates)
            .catch((error)=>{
                expect(error).toEqual(updateError);
            })
        })
    })
})
