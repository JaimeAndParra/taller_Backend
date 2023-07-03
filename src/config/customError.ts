import logger from "../utils/logger";

class DoctorError extends Error {
    constructor(message: string, fromComponent: string, error: any){
        logger.error(`${message} in ${fromComponent}: [${error}]`)
        super(message)
    }
}

class PatientError extends Error {
    constructor(message: string, fromComponent: string, error: any){
        logger.error(`${message} in ${fromComponent}: [${error}]`)
        super(message)
    }
}

class AppointmentError extends Error {
    constructor(message: string, fromComponent: string, error: any){
        logger.error(`${message} in ${fromComponent}: [${error}]`)
        super(message)
    }
}

class CustomError extends Error{
    constructor(message: string){
        super(message)
    }
}

class RecordNotFoundError extends Error {
    constructor(){
        super("Record has not found yet")
    }
}

class MustBeANumber extends Error {
    constructor(){
        super("ID must be a number")
    }
}

export {
    DoctorError,
    PatientError,
    AppointmentError,
    RecordNotFoundError,
    MustBeANumber,
    CustomError
} 
    

