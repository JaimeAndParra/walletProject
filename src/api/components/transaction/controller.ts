import { Request, Response } from "express";
import { createTransactionSchema, validateTransaction } from "./validations/transaction.validation";
import { TransactionReq } from "./model";
import { TransactionService } from "./service";
import { WalletService } from "../wallet/service";
import { CustomError } from "../../../utils/customError";

export interface TransactionController{
    getAllTransactions(req: Request, res:Response): Promise<void>,
    getTransactionById(req: Request, res:Response): Promise<void>,
    createTransaction(req: Request, res:Response): Promise<void>
};

export class TransactionControllerImpl implements TransactionController{

    private transactionService: TransactionService;
    private walletService: WalletService;

    constructor(transactionService: TransactionService, walletService: WalletService){
        this.transactionService = transactionService;
        this.walletService = walletService;
    }

    public async getAllTransactions(req: Request, res:Response): Promise<void> {
        await this.transactionService.getAllTransactions()
        .then((allTransactions)=>{
            res.status(200).json(allTransactions);
        },
        (error) => {
            res.status(400).json({message: `${error.message}`});
        })
    }

    public async getTransactionById(req: Request, res:Response): Promise<void> {
        const transaction_id = parseInt(req.params.transaction_id);
        if(isNaN(transaction_id)){
            res.status(400).json({message: `Error: ID must be a number`});
            return
        }
        await this.transactionService.getTransactionById(transaction_id)
        .then((transaction)=>{
            res.status(200).json(transaction);
        },
        (error) => {
            res.status(400).json({message: `${error.message}`});
        })
    }

    public async createTransaction(req: Request, res:Response): Promise<void> {
        const {error, value} =  createTransactionSchema.validate(req.body);
        if (error){
            res.status(400).json({message: `${error.details[0].message}`});
            return;
        }

        await this.walletService.getWalletById(value.wallet_id)
        .then(async (wallet)=>{
            validateTransaction(value, wallet);
            const transaction = await this.transactionService.createTransaction(value);
            return {wallet, transaction}
        })
        .then(async({wallet, transaction}) => {
            const amountDiscount = -1*transaction.amount;
            const walletDiscount = await this.walletService.rechargeWallet(wallet, amountDiscount);
            if (!walletDiscount){
                transaction.status = 'rechazado';
                transaction = await this.transactionService.updateTransaction(transaction);
            }
            res.status(201).json(transaction);
        })
        .catch(error=>{
            res.status(400).json({message: `${error.message}`});
        })
    }
}