import { Request, Response } from "express";
import { WalletController, WalletControllerImpl } from "../api/components/wallet/controller";
import { WalletService } from "../api/components/wallet/service";
import { WalletRes } from "../api/components/wallet/model";

const mockReq = {} as Request;
const mockRes = {} as Response;

describe('WalletController', () => {
    let walletService: WalletService;
    let walletController: WalletController;

    beforeEach(() => {
        walletService = {
            createWallet: jest.fn(),    
            rechargeWallet: jest.fn(),
            getWalletByUserId: jest.fn(), 
            getWalletById: jest.fn(), 
            limitTxWallet: jest.fn()
        }

        walletController = new WalletControllerImpl(walletService);
        mockRes.status = jest.fn().mockReturnThis();
        mockRes.json = jest.fn().mockReturnThis();
    })

    describe('CreateWallet', () => {
        it('should create new wallet and return info', async () => {
            const bodyReq:any = {
                user_id: 1,
            };
            
            const walletRes: WalletRes = {
                wallet_id: 1,
                user_id: 1,
                wallet_status: 'Active',
                transaction_min_amount: 2000
            };

            (mockReq.body as any) = bodyReq;
            (walletService.createWallet as jest.Mock).mockResolvedValue(walletRes);

            await walletController.createWallet(mockReq, mockRes)
            expect(walletService.createWallet).toHaveBeenCalledWith(bodyReq.user_id)
            expect(mockRes.json).toHaveBeenCalledWith(walletRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })
    })
})