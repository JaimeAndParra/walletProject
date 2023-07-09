import { Router } from 'express';
import { TransactionController, TransactionControllerImpl } from './controller';
import { TransactionService, TransactionServiceImpl } from './service';
import { TransactionRepository } from './repository';
import { WalletRepository } from '../wallet/repository';
import { WalletService, WalletServiceImpl } from '../wallet/service';

const transactionRepository:TransactionRepository = new TransactionRepository();
const transactionService:TransactionService = new TransactionServiceImpl(transactionRepository);
const walletRepository:WalletRepository = new WalletRepository();
const walletService:WalletService = new WalletServiceImpl(walletRepository);
const transactionController:TransactionController = new TransactionControllerImpl(transactionService, walletService);

const router = Router();

router.post('/create', transactionController.createTransaction.bind(transactionController))
router.patch('/:transaction_id/update')
router.get('/list', transactionController.getAllTransactions.bind(transactionController))
router.get('/:transaction_id', transactionController.getTransactionById.bind(transactionController))



export default router;