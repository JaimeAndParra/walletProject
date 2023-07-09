export interface TransactionReq {
    wallet_id: number,
    type: string,
    payee?: string,
    amount: number,
    status?: string,
    created_at?: Date,
    updated_at?: Date,
}

export interface Transaction {
    transaction_id: number,
    wallet_id: number,
    type: string,
    payee?: string,
    amount: number,
    status: string,
    created_at: Date,
    updated_at: Date,
}



