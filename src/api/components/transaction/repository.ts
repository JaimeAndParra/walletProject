import db from "../../../config/database";
import { CreateError, GetAllError, GetByIdError, UpdateError } from "../../../utils/customError";
import { Transaction, TransactionReq } from "./model";


export class TransactionRepository{

    public async getAllTransactions(): Promise<Transaction[]>{
        try{
            return await db.select('*').from('transaction');
        }catch(error){
            throw new GetAllError('transaction', 'TransactionRepository', error);
        }
    }

    public async getTransactionById(transaction_id: number): Promise<Transaction>{
        try{
            return await db('transaction').where({transaction_id: transaction_id}).first()
        }catch(error){
            throw new GetByIdError('transaction', 'TransactionRepository', error);
        }
    }

    public async createTransaction(transaction: TransactionReq): Promise<Transaction|any>{
        try{
            const [createTransaction]:any = await db('transaction').insert(transaction).returning('*');
            return createTransaction;
        }catch(error){
            throw new CreateError('transaction', 'TransactionRepository', error);
        }
    }

    public async updateTransaction(transaction: Transaction): Promise<Transaction>{
        try{
            const transaction_id = transaction.transaction_id;
            const [updateTransaction]:any = await db('wallet').where({transaction_id}).update(transaction).returning('*');
            return updateTransaction;
        }catch(error){
            throw new UpdateError('Transaction', 'TransactionRepository', error);
        }
    }


}