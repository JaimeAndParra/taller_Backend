import logger from "./logger"

class CreateError extends Error {
    constructor(entity: string, component: string, error: any){
        const message = `Error creating a new ${entity}`
        logger.error(`${message} in ${component}: [${error}]`)
        super(message)
    }
}

class GetAllError extends Error {
    constructor(entity: string, component: string, error: any){
        const message = `Error getting all ${entity}s`
        logger.error(`${message} in ${component}: [${error}]`)
        super(message)
    }
}

class GetError extends Error {
    constructor(entity: string, component: string, error: any){
        const message = `Error getting ${entity}`
        logger.error(`${message} in ${component}: [${error}]`)
        super(message)
    }
}

class RecordNotFoundError extends Error {
    constructor(entity: string){
        super(`${entity} has not been found.`)
    }
}

class RecordAlreadyExistsError extends Error{
    constructor(entity: string){
        super(`Record has not been created. ${entity} already exists`)
    }
}

class UpdateError extends Error {
    constructor(entity: string, component: string, error: any){
        const message = `Error updating ${entity}`
        logger.error(`${message} in ${component}: [${error}]`)
        super(message)
    }
}

class DeleteError extends Error {
    constructor(entity: string, component: string, error: any){
        const message = `Error deleting ${entity}`
        logger.error(`${message} in ${component}: [${error}]`)
        super(message)
    }
}

class CustomError extends Error{
    constructor(message: string){
        super(message)
    }
}

export {
    CreateError,
    GetAllError,
    RecordNotFoundError,
    GetError,
    UpdateError,
    DeleteError,
    RecordAlreadyExistsError,
    CustomError
}