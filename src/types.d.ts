export type WalletType = {
    alias: string;
    name: string;
    balance?: {
        confirmed: number;
        pending: number;
    }
    transactions?: TransactionType[],
    addresses: AddressType[];
    updatedAt: number;
    createdAt: number;
}

export type AddressType = {
    value: string;
    qrcode?: string;
    balance: {
        confirmed: number;
        pending: number;
    };
    used: boolean;
    transactions: TransactionType[];
    createdAt: number;
}

export type TransactionType = {
    ref: string;
    fees: number;
    confirmations: number;
    senders: {
        address: {
            value: string;
            owned?: boolean;
        },
        amount: string;
    }[];
    receivers: {
        address: {
            value: string;
            owned?: boolean;
        },
        amount: string;
    }[];
    createdAt: number;
}