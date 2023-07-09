import { Router } from 'express';
import { WalletRepository } from './repository';
import { WalletService, WalletServiceImpl } from './service';
import { WalletController, WalletControllerImpl } from './controller';

const router = Router();

const walletRepository:WalletRepository = new WalletRepository();
const walletService:WalletService = new WalletServiceImpl(walletRepository);
const walletController:WalletController = new WalletControllerImpl(walletService);

router.post('/create', walletController.createWallet.bind(walletController));
router.patch('/:wallet_id/recharge', walletController.rechargeWallet.bind(walletController));
router.patch('/:wallet_id/refund', walletController.refundWallet.bind(walletController));
router.patch('/:wallet_id/limit', walletController.limitTxAmountWallet.bind(walletController));

export default router;