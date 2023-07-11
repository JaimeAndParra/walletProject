import { Request, Response } from "express";
import { WalletController, WalletControllerImpl } from "../api/components/wallet/controller";
import { WalletService } from "../api/components/wallet/service";
import { Wallet, WalletRes } from "../api/components/wallet/model";
import { CustomError } from "../utils/customError";

const mockReq = {} as Request;
const mockRes = {} as Response;

describe('WalletController', () => {
    let walletService: WalletService;
    let walletController: WalletController;
    let wallet: Wallet;
    let nowDate: Date;

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
        
        nowDate = new Date();
        wallet = {
            wallet_id: 1,
            user_id: 1,
            min_amount: 2000,
            max_amount: 10,
            amount: 0,
            status: 'Active',
            created_at: nowDate,
            updated_at: nowDate,
        };
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

    describe('RechargeWallet', () => {
        it('should update wallet amount and return info', async () => {

            const wallet_id = "1";
            (mockReq.params) = {wallet_id: wallet_id};
            const bodyReq:any = {
                amount: 5000,
            };
            (mockReq.body) = bodyReq;

            const updateWallet = {...wallet};
            updateWallet.amount += bodyReq.amount;

            (walletService.getWalletById as jest.Mock).mockResolvedValue(wallet);
            (walletService.rechargeWallet as jest.Mock).mockResolvedValue(updateWallet);
            
            await walletController.rechargeWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(parseInt(wallet_id));
            expect(walletService.rechargeWallet).toHaveBeenCalledWith(wallet, bodyReq.amount);
            expect(mockRes.json).toHaveBeenCalledWith(updateWallet)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        }),
        it('should be handler error and return 400 when body request is wrong', async () => {
            const walletRecharge = {
                test: 1000
            };

            (mockReq.params) = {wallet_id: "1"};
            (mockReq.body as {test: number}) = walletRecharge;

            (walletService.getWalletById as jest.Mock).mockResolvedValue(wallet);

            await walletController.rechargeWallet(mockReq, mockRes)
            
            expect(walletService.getWalletById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith({"message": "\"amount\" is required"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
        it('should be handler error and return 400 when wallet doesnt exist', async () => {
            const walletRecharge = {
                amount: 1000
            };

            (mockReq.params) = {wallet_id: "1"};
            (mockReq.body as any) = walletRecharge;

            (walletService.getWalletById as jest.Mock).mockRejectedValue(new CustomError('Failed getting wallet'));

            await walletController.rechargeWallet(mockReq, mockRes)
            
            expect(walletService.getWalletById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith({"message": 'Failed getting wallet'})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
        it('should be handler error and return 400 when recharge exceeds max_amount', async () => {
            const walletRecharge = {
                amount: 5000001
            };

            (mockReq.params) = {wallet_id: "1"};
            (mockReq.body as {amount: number}) = walletRecharge;

            (walletService.getWalletById as jest.Mock).mockResolvedValue(wallet);

            await walletController.rechargeWallet(mockReq, mockRes)
            
            expect(walletService.getWalletById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith({"message": 'Error, amount to recharge wallet is to high'})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })

    describe('RefundWallet', () => {
        it('should update wallet amount with refund value and return info', async () => {

            const wallet_id = "1";
            (mockReq.params) = {wallet_id: wallet_id};
            const bodyReq:any = {
                amount: 5000,
            };
            (mockReq.body) = bodyReq;

            const updateWallet = {...wallet};
            updateWallet.amount += bodyReq.amount;

            (walletService.getWalletById as jest.Mock).mockResolvedValue(wallet);
            (walletService.rechargeWallet as jest.Mock).mockResolvedValue(updateWallet);
            
            await walletController.rechargeWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(parseInt(wallet_id));
            expect(walletService.rechargeWallet).toHaveBeenCalledWith(wallet, bodyReq.amount);
            expect(mockRes.json).toHaveBeenCalledWith(updateWallet)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })
        it('should be handler error and return 400 when body request is wrong', async () => {
            const walletRecharge = {
                test: 1000
            };

            (mockReq.params) = {wallet_id: "1"};
            (mockReq.body as {test: number}) = walletRecharge;

            (walletService.getWalletById as jest.Mock).mockResolvedValue(wallet);

            await walletController.rechargeWallet(mockReq, mockRes)
            
            expect(walletService.getWalletById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith({"message": "\"amount\" is required"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
        it('should be handler error and return 400 when wallet doesnt exist', async () => {
            const walletRecharge = {
                amount: 1000
            };

            (mockReq.params) = {wallet_id: "1"};
            (mockReq.body as any) = walletRecharge;

            (walletService.getWalletById as jest.Mock).mockRejectedValue(new CustomError('Failed getting wallet'));

            await walletController.rechargeWallet(mockReq, mockRes)
            
            expect(walletService.getWalletById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith({"message": 'Failed getting wallet'})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })

    describe('LimitTxAmountWallet', () => {
        it('should set up limit tx amount wallet and return info', async () => {

            const wallet_id = "1";
            (mockReq.params) = {wallet_id: wallet_id};

            const bodyReq:any = {
                maxAmount: 50000,
            };
            (mockReq.body as {maxAmount: number}) = bodyReq;

            const updateWallet:Wallet = {...wallet};
            updateWallet.max_amount = bodyReq.maxAmount;

            (walletService.getWalletById as jest.Mock).mockResolvedValue(wallet);
            (walletService.limitTxWallet as jest.Mock).mockResolvedValue(updateWallet);
            
            await walletController.limitTxAmountWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(parseInt(wallet_id));
            expect(walletService.limitTxWallet).toHaveBeenCalledWith(wallet, bodyReq.maxAmount);
            expect(mockRes.json).toHaveBeenCalledWith(updateWallet);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        })
        it('should be handler error and return 400 when body request is wrong', async () => {
            const maxAmountWallet = {
                test: 1000
            };

            (mockReq.params) = {wallet_id: "1"};
            (mockReq.body as {test: number}) = maxAmountWallet;

            (walletService.getWalletById as jest.Mock).mockResolvedValue(wallet);

            await walletController.limitTxAmountWallet(mockReq, mockRes)
            
            expect(walletService.getWalletById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith({"message": "\"maxAmount\" is required"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
        it('should be handler error and return 400 when wallet doesnt exist', async () => {
            const maxAmountWallet = {
                maxAmount: 1000
            };

            (mockReq.params) = {wallet_id: "1"};
            (mockReq.body as any) = maxAmountWallet;

            (walletService.getWalletById as jest.Mock).mockRejectedValue(new CustomError('Failed getting wallet'));

            await walletController.rechargeWallet(mockReq, mockRes)
            
            expect(walletService.getWalletById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith({"message": 'Failed getting wallet'})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })
})