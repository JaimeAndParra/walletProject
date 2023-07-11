import { WalletService, WalletServiceImpl } from "../api/components/wallet/service";
import { WalletRepository } from "../api/components/wallet/repository";
import { Wallet, WalletRes } from "../api/components/wallet/model";

describe('WalletService', () => {
    let walletService: WalletService;
    let walletRepository: WalletRepository;

    beforeEach(() => {
        walletRepository = {
            createWallet: jest.fn(),
            getWalletById: jest.fn(),
            getWalletByUserId: jest.fn(),
            updateWallet: jest.fn(),
        }

        walletService = new WalletServiceImpl(walletRepository);
    })

    describe('CreateWallet', () => {
        it('should create new wallet and return info', async () => {
            
            const user_id:number = 1;
            const now = new Date();

            const walletRes: WalletRes = {
                wallet_id: 1,
                user_id: 1,
                wallet_status: 'Active',
                transaction_min_amount: 2000
            };

            const wallet: Wallet = {
                wallet_id: 1,
                user_id: user_id,
                min_amount: 2000,
                max_amount: 0,
                amount: 0,
                status: 'Active',
                created_at: now,
                updated_at: now,
            };

            const walletInsert = {
                user_id: user_id,
                min_amount: 2000,
                amount: 0,
                status: 'Active',
                created_at: now,
                updated_at: now,
            };

            (walletRepository.getWalletByUserId as jest.Mock).mockResolvedValue(undefined);
            (walletRepository.createWallet as jest.Mock).mockResolvedValue(wallet);
            
            const result = await walletService.createWallet(user_id);

            expect(walletRepository.getWalletByUserId).toHaveBeenCalledWith(user_id);
            expect(walletRepository.createWallet).toHaveBeenCalledWith(walletInsert);
            expect(result).toEqual(walletRes);
        })
    })
})