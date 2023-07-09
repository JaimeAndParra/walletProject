import { CreateError, CustomError, GetByIdError, UpdateError } from "../../../utils/customError";
import { WalletRepository } from "./repository";
import { Wallet, WalletDBInsert, WalletRes } from "./model";
import logger from "../../../utils/logger";

export interface WalletService {
    createWallet(user_id: number): Promise<WalletRes>,
    getWalletByUserId(user_id: number): Promise<Wallet>,
    getWalletById(wallet_id: number): Promise<Wallet>,
    rechargeWallet(wallet: Wallet, amountRecharge: number): Promise<Wallet>,
    limitTxWallet(wallet: Wallet, limitTxAmount: number): Promise<Wallet>
}

export class WalletServiceImpl implements WalletService {

    private walletRepository: WalletRepository;

    constructor(walletRepository: WalletRepository){
        this.walletRepository = walletRepository;
    }

    public async createWallet(user_id: number): Promise<WalletRes> {
        try{

            const wallet = await this.walletRepository.getWalletByUserId(user_id);
            if(wallet) throw new CustomError('Wallet already exist');

            const min_amount: number = 2000;
            const status: string = 'Active';
            const now: Date = new Date;
            
            const walletInsert: WalletDBInsert = {
                user_id: user_id,
                min_amount: min_amount,
                amount: 0,
                status: status,
                created_at: now,
                updated_at: now,
            };

            const createdWallet:Wallet = await this.walletRepository.createWallet(walletInsert);
            logger.info(`New wallet created: ${JSON.stringify(createdWallet)}`)
            
            const walletRes: WalletRes = {
                wallet_id: createdWallet.wallet_id,
                user_id: createdWallet.user_id,
                wallet_status: createdWallet.status,
                transaction_min_amount: createdWallet.min_amount,
            };
            
            return walletRes;

        }catch(error){
            if (error instanceof CreateError) throw error;
            if (error instanceof CustomError) throw error;
            throw new CreateError('wallet', 'WalletService', error);
        }
    }

    public async getWalletByUserId(user_id: number): Promise<Wallet> {
        try{
            const wallet = await this.walletRepository.getWalletByUserId(user_id);
            if (!wallet) throw new CustomError('Wallet not found.');
            return wallet;
        }catch(error){
            if (error instanceof GetByIdError) throw error;
            if (error instanceof CustomError) throw error;
            throw new GetByIdError('wallet', 'WalletService', error);
        }
    }

    public async getWalletById(wallet_id: number): Promise<Wallet> {
        try{
            const wallet = await this.walletRepository.getWalletById(wallet_id);
            if (!wallet) throw new CustomError('Wallet not found.');
            return wallet;
        }catch(error){
            if (error instanceof GetByIdError) throw error;
            if (error instanceof CustomError) throw error;
            throw new GetByIdError('wallet', 'WalletService', error);
        }
    }

    public async rechargeWallet(wallet: Wallet, amountRecharge: number): Promise<Wallet>{
        try{            
            const newAmount = wallet.amount + amountRecharge;
            const updateWallet = {...wallet, ...{amount: newAmount, updated_at: new Date()}};
            return await this.walletRepository.updateWallet(updateWallet);
        }catch(error){
            if (error instanceof UpdateError) throw error;
            throw new UpdateError('wallet', 'WalletService', error);
        }
    }

    public async limitTxWallet(wallet: Wallet, limitTxAmount: number): Promise<Wallet>{
        try{
            const updateWallet = {...wallet, ...{max_amount: limitTxAmount, updated_at: new Date()}};
            return await this.walletRepository.updateWallet(updateWallet);
        }catch(error){
            if (error instanceof UpdateError) throw error;
            throw new UpdateError('wallet', 'WalletService', error);
        }
    }

}