import { DoctorService, DoctorServiceImpl } from "../api/components/doctores/service";
import { Doctor, DoctorReq } from "../api/components/doctores/model";
import { DoctorRepository } from "../api/components/doctores/repository";

describe('DoctorService', () => {
    let doctorService: DoctorService;
    let doctorRespository: DoctorRepository;

    /* El mock emula el comportamiento del Service */

    beforeEach(() => {
        doctorRespository = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn()
        },
        doctorService = new DoctorServiceImpl(doctorRespository)  
    })
    describe('getAllDoctors', () => {
        it('should be get all doctors', async () => {
            const doctors: Doctor[] = [
                {id_doctor:1, nombre:"Carlos", apellido:"Caceres", especialidad:"Medicina General", consultorio:"100", correo:"carcec@gmail.com"},
                {id_doctor:2, nombre:"Jaime", apellido:"Parra", especialidad:"Ortopedia", consultorio:"101", correo:"jaipar@gmail.com"},
            ];

            (doctorRespository.getAllDoctors as jest.Mock).mockResolvedValue(doctors)
            const result = await doctorService.getAllDoctors()
            
            /* Valores esperados */
            expect(doctorRespository.getAllDoctors).toHaveBeenCalled()
            expect(result).toEqual(doctors)
        })
        it('should return an empty array when there are not doctors', async () => {
            const doctors: Doctor[] = [];

            (doctorRespository.getAllDoctors as jest.Mock).mockResolvedValue(doctors)
            const result = await doctorService.getAllDoctors()
            
            /* Valores esperados */
            expect(doctorRespository.getAllDoctors).toHaveBeenCalled()
            expect(result).toEqual([])
        })
    })

    describe('create Doctor', () => {
        it('should create a new doctor and return it', async () => {
            const doctorRes: Doctor = {id_doctor:2, nombre:"Jaime", apellido:"Parra", especialidad:"Ortopedia", consultorio:"101", correo:"jaipar@gmail.com"};
            const doctorReq: DoctorReq = {nombre:"Jaime", apellido:"Parra", especialidad:"Ortopedia", consultorio:"101", correo:"jaipar@gmail.com"};

            (doctorRespository.createDoctor as jest.Mock).mockResolvedValue(doctorRes)
            const result = await doctorService.createDoctor(doctorReq)
            
            expect(result).toEqual(doctorRes)
            // expect(doctorRespository.createDoctor).toHaveBeenCalledWith(doctorReq)
        })
        /* it('should throw and error if doctor creation fails', async () => {
            const error = new Error("Failed to create a doctor")
            const doctorReq: DoctorReq = {nombre:"Jaime", apellido:"Parra", especialidad:"Ortopedia", consultorio:"101", correo:"jaipar@gmail.com"};
            (doctorRespository.createDoctor as jest.Mock).mockRejectedValue(error)
            const result = await doctorService.createDoctor(doctorReq)
            
            expect(doctorRespository.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(result).rejects.toThrowError(error)
        }) */
    })
})
