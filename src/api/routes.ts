import { Router } from 'express';
import transactionRoutes from './components/transaction/routes'
import walletRoutes from './components/wallet/routes'

const router = Router();

router.use('/transaction', transactionRoutes)
router.use('/wallet', walletRoutes)

export default router;