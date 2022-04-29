import { Card, CardHeader, CardContent, Icon, Divider, Box, Typography, Button } from "@mui/material"
import { useState } from "react";
import { WalletType } from "../types";

type Props = {
    wallets: WalletType[];
    onChangeActiveWallet: (value: number) => void;
    onAddWallet?: () => void;
}

export const WalletCollection: React.FC<Props> = (props) => {

    return <Card elevation={6}>
        <CardHeader 
            title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>account_balance_wallet</Icon> Collection (CHOOSE YOUR WALLET)</Typography>
            </Box>}
        />
        <Divider />
        <CardContent sx={{ overflowX: 'scroll', paddingLeft: 0, paddingRight: 0, paddingBottom: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'horizontal', gap: '1em', width: 'fit-content', padding: '0 1em' }}>
                { props.wallets && props.wallets.map((wallet, index) => {
                    return <Button key={index} onClick={() => props.onChangeActiveWallet(index)} color="secondary" variant="contained" sx={{ textTransform: 'none', minWidth: '10rem', width: '10rem', minHeight: '5rem', height: '5rem', padding: '1em' }}>
                        <Box sx={{ height: '100%', width: '100%' }}>
                            <Typography align="left" sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{wallet.name}</Typography>
                        </Box>
                    </Button>
                }) }
                { props.onAddWallet &&
                    <Button onClick={() => props.onAddWallet!()} color="secondary" variant="outlined" sx={{ textTransform: 'none', minWidth: '10rem', width: '10rem', minHeight: '5rem', height: '5rem', padding: '1em' }}>
                        <Icon sx={{ fontSize: "2rem" }}>add_box</Icon>
                    </Button>
                }
            </Box>
        </CardContent>
    </Card>
}