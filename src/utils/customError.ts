import e from "express"
import logger from "./logger"

class GetAllError extends Error{
    constructor(entity: string, component: string, error: any){
        const message = `Failed getting all ${entity}s`
        super(message)
        logger.error(`${message} in ${component}: [${error}]`)
    }
}

class GetByIdError extends Error{
    constructor(entity: string, component: string, error: any){
        const message = `Failed getting ${entity}`
        super(message)
        logger.error(`${message} in ${component}: [${error}]`)
    }
}

class CustomError extends Error{
    constructor(message: string){
        super(message);
    }
}

class CreateError extends Error {
    constructor(entity: string, component: string, error: any){
        const message = `Failed creating ${entity}`
        super(message)
        logger.error(`${message} in ${component}: [${error}]`)
    }
}

class UpdateError extends Error{
    public entity:string;
    constructor(entity:string, component: string, error: any){
        const message = `Failed to update ${entity}`;
        super(message)
        this.entity = entity;
        logger.error(`${message} in ${component}: [${error}]`)
    }
}

export{
    CustomError,
    GetAllError,
    GetByIdError,
    CreateError,
    UpdateError
}