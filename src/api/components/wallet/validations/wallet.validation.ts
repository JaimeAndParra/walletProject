import Joi from "joi";
import { CustomError } from "../../../../utils/customError";
import { Wallet } from "../model";

const rechargeWalletSchema = Joi.object({
    amount: Joi.number().min(0).required(),
})

const limitTxWalletSchema = Joi.object({
    maxAmount: Joi.number().min(0).max(5000000).required(),
})

const typeValidationSchema:{[key: string]: (reqBody: any) => any} = {
    RECHARGE: (reqBody: any):any => {
        return rechargeWalletSchema.validate(reqBody);
    },
    REFUND: (reqBody: any):any => {
        return rechargeWalletSchema.validate(reqBody);
    },
    LIMIT_TX: (reqBody: any):any => {
        return limitTxWalletSchema.validate(reqBody);
    },
}

function validateAmount(reqBody:Object, wallet: Wallet, type:string){

    const validation = typeValidationSchema[type](reqBody);
    if(validation.error) throw new CustomError(`${validation.error.details[0].message}`);
    if(wallet.status!='Active') throw new CustomError('Error, Wallet is not active');

    const amount = validation.value;
    
    if(type === 'RECHARGE'){
        let newAmount:number = wallet.amount + amount;
        if(5000000 < newAmount) throw new CustomError('Error, amount to recharge wallet is to high');
    }

    return amount;
}

export {
    validateAmount,
}