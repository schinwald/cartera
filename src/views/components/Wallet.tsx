import { Grid, Card, CardHeader, CardContent, Icon, Fab, Divider, Box, Typography, Chip, Button, Paper } from "@mui/material"
import { styled } from "@mui/material"
import { useState } from "react";
import { Copy, FancyCard } from "./primitives";
import { WalletType, AddressType } from "../../types";
import AnimatedNumber from "react-awesome-animated-number";
import useSWR, { useSWRConfig } from 'swr';
import fetch from 'isomorphic-fetch';
import { QRCode } from ".";

type Props = {
    wallet?: WalletType;
}

export const Wallet: React.FC<Props> = (props) => {
    const { mutate } = useSWRConfig();
    let [ editMode, setEditMode ] = useState<boolean>(false);
    let activeAddress: AddressType | null = null;

    if (props.wallet) {
        activeAddress = props.wallet.addresses.reduce((previous, current, index) => {
            if (index === 0) return previous
            if (previous.createdAt > current.createdAt) return previous
            else return current
        })
    }

    const onLoadMoney = (value: number) => {
        if (activeAddress) {
            fetch('/wallet/load', {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify({
                        address: activeAddress.value,
                        amount: value
                    })
                })
                .then((response: any) => {
                    mutate('/wallets')
                    mutate('/addresses')
                    return response.json()
                })
                .then((data: any) => {})
                .catch((error: any) => {

                })
        }
    }

    return ( 
        props.wallet && props.wallet.balance && activeAddress
        ?
        <FancyCard elevation={6}>
            <CardHeader 
                title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    { 
                        editMode
                        ?
                        <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>credit_card</Icon> {props.wallet.alias}</Typography>
                        :
                        <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>credit_card</Icon> {props.wallet.alias}</Typography>
                    }
                    <Fab color="secondary" size="small" onClick={() => {
                        if (editMode) {
                            console.log("submit rename")
                        }
                        setEditMode(!editMode)
                    }}><Icon>{editMode ? "done" : "edit"}</Icon></Fab>
                </Box>}
            />
            <Divider />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: '1em' }}>
                            <Chip label="Balance" size="small" />
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                                <Typography color="secondary.dark" variant="h1" sx={{ display: 'flex' }}>
                                    $
                                    <AnimatedNumber
                                        value={props.wallet.balance.confirmed + props.wallet.balance.pending}
                                        style={{
                                            transition: '0.8s ease-out',
                                            transitionProperty: 'background-color, color, opacity',
                                            display: 'flex',
                                            flexDirection: 'row-reverse',
                                            overflowY: 'hidden',
                                        }}
                                        size={96}
                                        hasComma={true}
                                        duration={300}/>
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h4">BCY</Typography>
                                    <Typography variant="h4">Test</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                                    <Typography><Icon sx={{ verticalAlign: 'middle' }}>fingerprint</Icon>{activeAddress.value}</Typography>
                                    <Copy text={activeAddress.value} placement="right" />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em', padding: "0.5em 0.5em" }}>
                                    <Button onClick={() => { onLoadMoney(100000) }} color="secondary" variant="contained" startIcon={<Icon>receipt</Icon>}>Load Money</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em' }}>
                            <Chip label="QR Code" size="small" />
                            <Paper sx={{ border: '1px solid', borderColor: '#00000030' }}>
                                <QRCode data={activeAddress.value} alt={`QR Code of address: ${activeAddress.value}`} size={256} />
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </FancyCard>
        :
        null
    )
}