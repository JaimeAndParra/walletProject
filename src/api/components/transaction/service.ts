import { CreateError, CustomError, GetAllError, GetByIdError, UpdateError } from "../../../utils/customError";
import { TransactionReq, Transaction } from "./model";
import { TransactionRepository } from "./repository";

export interface TransactionService {
    getAllTransactions(): Promise<Transaction[]>
    getTransactionById(transaction_id: number): Promise<Transaction>,
    createTransaction(transaction: TransactionReq): Promise<Transaction>,
    updateTransaction(transaction: TransactionReq): Promise<Transaction>,
}

export class TransactionServiceImpl implements TransactionService {

    private transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository){
        this.transactionRepository = transactionRepository;
    }

    public async getAllTransactions(): Promise<Transaction[]> {
        try{
            const allTransactions = await this.transactionRepository.getAllTransactions();
            if (!allTransactions.length) throw new CustomError('There are no registered transactions.');
            return allTransactions;
        }catch(error){
            if (error instanceof CustomError) throw error;
            throw new GetAllError('transaction', 'TransactionService', error);
        }
    }

    public async getTransactionById(transaction_id: number): Promise<Transaction> {
        try{
            const transaction = await this.transactionRepository.getTransactionById(transaction_id);
            if(!transaction) throw new CustomError('Transaction not found.');
            return transaction;
        }catch(error){
            if (error instanceof CustomError) throw error;
            if (error instanceof GetByIdError) throw error;
            throw new GetByIdError('transaction', 'TransactionService', error);
        }
    }

    public async createTransaction(transaction: TransactionReq): Promise<Transaction>{
        try{
            const now = new Date();
            transaction.created_at = now;
            transaction.updated_at = now;
            transaction.status = 'exitoso';
            return await this.transactionRepository.createTransaction(transaction);
        }catch(error){
            if (error instanceof CreateError) throw error;
            throw new CreateError('transaction', 'TransactionService', error);
        }
    }

    public async updateTransaction(transaction: Transaction): Promise<Transaction> {
        try{
            transaction.updated_at = new Date();
            return await this.transactionRepository.updateTransaction(transaction);

        }catch(error){
            if (error instanceof UpdateError) throw error;
            throw new UpdateError('Transaction', 'TransactionService', error);
        }
    }

}