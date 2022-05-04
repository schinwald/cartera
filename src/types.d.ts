export type WalletType = {
    alias: string;
    name: string;
    addresses: AddressType[];
    createdAt: Date;
}

export type AddressType = {
    value: string;
    qrcode: string;
    balance: {
        confirmed: number;
        pending: number;
    };
    transactions: TransactionType[];
    createdAt: Date;
}

export type TransactionType = {
    confirmed: boolean;
    senders: {
        address: string;
        amount: string;
    }[];
    receivers: {
        address: string;
        amount: string;
    }[];
    createdAt: Date;
}