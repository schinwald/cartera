import { Card, CardHeader, CardContent, Icon, Divider, Box, Typography, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useRef, useState } from "react";
import { WalletType } from "../../types";

const WalletButton = styled(Button)`
    position: relative;
    &::before {
        content: "";
        position: absolute;
        top: 60%; right: 0%; bottom: 20%; left: 0%;
        background-color: black;
    }
`;

type Props = {
    value: number,
    wallets: WalletType[];
    onChangeActiveWallet: (value: number) => void;
    onAddWallet?: () => void;
}

export const WalletCollection: React.FC<Props> = (props) => {
    const walletButtonCSS = {
        active: {
            minWidth: '10rem',
            width: '10rem',
            minHeight: '5rem',
            height: '5rem',
            textTransform: 'none',
            padding: '1em'
        },
        inactive: {
            minWidth: '8rem',
            width: '8rem',
            minHeight: '4rem',
            height: '4rem',
            textTransform: 'none',
            padding: '1em'
        }
    }

    return <Card elevation={6}>
        <CardHeader 
            title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>account_balance_wallet</Icon> Collection (CHOOSE YOUR WALLET)</Typography>
            </Box>}
        />
        <Divider />
        <CardContent sx={{ overflowX: 'scroll', overflowY: 'hidden', paddingLeft: 0, paddingRight: 0, paddingBottom: '16px', height: walletButtonCSS.active.height }}>
            <Box sx={{ display: 'flex', flexDirection: 'horizontal', gap: '1em', width: 'fit-content', padding: '0 1em' }}>
                { props.wallets && props.wallets.map((wallet, index) => {
                    return <WalletButton key={index} onClick={() => props.onChangeActiveWallet(index)} color="secondary" variant="contained" sx={{ transition: 'all 0.2s ease-in-out', ...(props.value === index) ? walletButtonCSS.active : walletButtonCSS.inactive }}>
                        <Box sx={{ height: '100%', width: '100%' }}>
                            <Typography align="left" sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{wallet.name}</Typography>
                        </Box>
                    </WalletButton>
                }) }
                { props.onAddWallet &&
                    <Button onClick={() => props.onAddWallet!()} color="secondary" variant="outlined" sx={{ ...walletButtonCSS.inactive }}>
                        <Icon sx={{ fontSize: "2rem" }}>add_box</Icon>
                    </Button>
                }
            </Box>
        </CardContent>
    </Card>
}