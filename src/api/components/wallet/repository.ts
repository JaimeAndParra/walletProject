import db from "../../../config/database";
import { CreateError, GetByIdError, UpdateError } from "../../../utils/customError";
import { Wallet, WalletDBInsert } from "./model";


export class WalletRepository{

    public async createWallet(wallet: WalletDBInsert): Promise<Wallet|any>{
        try{
            const [createWallet]:any = await db('wallet').insert(wallet).returning('*');
            return createWallet;
        }catch(error){
            throw new CreateError('wallet', 'WalletRepository', error);
        }
    }

    public async getWalletByUserId(user_id: number): Promise<Wallet>{
        try{
            return await db('wallet').where({user_id}).first()
        }catch(error){
            throw new GetByIdError('wallet', 'WalletRepository', error);
        }
    }

    public async getWalletById(wallet_id: number): Promise<Wallet>{
        try{
            return await db('wallet').where({wallet_id}).first()
        }catch(error){
            throw new GetByIdError('wallet', 'WalletRepository', error);
        }
    }

    public async updateWallet(wallet: Wallet): Promise<Wallet>{
        try{
            const wallet_id = wallet.wallet_id;
            const [updateWallet]:any = await db('wallet').where({wallet_id}).update(wallet).returning('*');
            return updateWallet;
        }catch(error){
            throw new UpdateError('wallet', 'WalletRepository', error);
        }
    }

}