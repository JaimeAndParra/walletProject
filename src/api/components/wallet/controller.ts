import { Request, Response } from "express";
import { WalletService } from "./service";
import { validateAmount } from "./validations/wallet.validation";

export interface WalletController{
    createWallet(req: Request, res:Response): Promise<void>,
    rechargeWallet(req: Request, res:Response): Promise<void>,
    refundWallet(req: Request, res:Response): Promise<void>,
    limitTxAmountWallet(req: Request, res:Response): Promise<void>
};

export class WalletControllerImpl implements WalletController{

    private walletService: WalletService;

    constructor(walletService: WalletService){
        this.walletService = walletService;
    }

    public async createWallet(req: Request, res:Response): Promise<void> {
        const user_id = parseInt(req.body.user_id);
        if(isNaN(user_id)){
            res.status(400).json({message: `Error: user_id must be a number`});
            return
        }
        await this.walletService.createWallet(user_id)
        .then((walletRes)=>{
            res.status(201).json(walletRes);
        },
        (error)=>{
            res.status(400).json({message: `${error.message}`});
        })
    }

    public async rechargeWallet(req: Request, res:Response): Promise<void> {
        
        const wallet_id = parseInt(req.params.wallet_id);
        if(isNaN(wallet_id)){
            res.status(400).json({message: `Error: wallet_id must be a number`});
            return
        }

        await this.walletService.getWalletById(wallet_id)
        .then(async (wallet)=>{
            const {amount} = validateAmount(req.body, wallet, 'RECHARGE');
            return await this.walletService.rechargeWallet(wallet, amount);
        })
        .then((wallet) => {
            res.status(200).json(wallet);
        })
        .catch(error=>{
            res.status(400).json({message: `${error.message}`});
        })
    }

    public async refundWallet(req: Request, res:Response): Promise<void> {

        const wallet_id = parseInt(req.params.wallet_id);
        if(isNaN(wallet_id)){
            res.status(400).json({message: `Error: wallet_id must be a number`});
            return
        }

        await this.walletService.getWalletById(wallet_id)
        .then(async(wallet)=>{
            const {amount} = validateAmount(req.body, wallet, 'REFUND');
            return await this.walletService.rechargeWallet(wallet, amount);
        })
        .then((wallet) => {
            res.status(200).json(wallet);
        })
        .catch(error=>{
            res.status(400).json({message: `${error.message}`});
        })  
    }

    public async limitTxAmountWallet(req: Request, res:Response): Promise<void> {

        const wallet_id = parseInt(req.params.wallet_id);
        if(isNaN(wallet_id)){
            res.status(400).json({message: `Error: wallet_id must be a number`});
            return
        }

        await this.walletService.getWalletById(wallet_id)
        .then(async(wallet)=>{
            const {maxAmount} = validateAmount(req.body, wallet, 'LIMIT_TX');
            return await this.walletService.limitTxWallet(wallet, maxAmount);
        })
        .then((wallet) => {
            res.status(200).json(wallet);
        })
        .catch(error=>{
            res.status(400).json({message: `${error.message}`});
        })  
    }

    
}