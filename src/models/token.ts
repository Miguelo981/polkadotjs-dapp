export interface TokenBalanceResponse {
    balance: number;
    reserved?: number;
    symbol: string;
}

export interface TransactionPreview {
    fee: number;
    total: number;
}