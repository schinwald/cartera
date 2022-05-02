export type WalletType = {
    alias: string;
    name: string;
    addresses: AddressType[];
    balance: number;
    updatedAt: Date;
    createdAt: Date;
}

export type AddressType = {
    value: string;
    createdAt: Date;
}