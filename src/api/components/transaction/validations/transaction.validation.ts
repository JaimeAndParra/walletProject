import Joi from "joi";
import { Wallet } from "../../wallet/model";
import { TransactionReq } from "../model";
import { CustomError } from "../../../../utils/customError";

enum txType {
    VALIDADAS = 'validada',
    DIRECTA = 'directa',
    INGRESO = 'ingreso'
}

const createTransactionSchema = Joi.object({
    wallet_id: Joi.number().required(),
    type: Joi.string().valid(...Object.values(txType)).required(),
    payee: Joi.string(),
    amount: Joi.number().required()
})


function validateTransaction(transactionReq:TransactionReq, wallet: Wallet){
    if(wallet.status!='Active') throw new CustomError('Error, Wallet is not active');
    if (wallet.min_amount > transactionReq.amount) throw new CustomError('Error, amount is less than allowed.');
    if(wallet.max_amount){
        if (wallet.max_amount < transactionReq.amount) throw new CustomError('Error, amount exceeds the max allowed');
    }
    if(wallet.amount<transactionReq.amount) throw new CustomError('Error, The amount exceeds existing funds.');
}

export {
    createTransactionSchema,
    validateTransaction,
}