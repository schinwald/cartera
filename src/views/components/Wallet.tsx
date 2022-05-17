import { Grid, Card, CardHeader, CardContent, Icon, Fab, Divider, Box, Typography, Chip, Button, Paper, TextField } from "@mui/material"
import { styled } from "@mui/material"
import { useEffect, useState, useRef } from "react";
import { Copy, FancyCard } from "./primitives";
import { WalletType, AddressType } from "../../types";
import AnimatedNumber from "react-awesome-animated-number";
import useSWR, { useSWRConfig } from 'swr';
import fetch from 'isomorphic-fetch';
import { QRCode } from ".";
import { LoadingButton } from "@mui/lab";

const RenameTypography = styled(TextField)`
    & .MuiInputBase-input {
        font-size: 1.5rem;
        padding: 0;
    }
`

type Props = {
    wallet?: WalletType;
}

export const Wallet: React.FC<Props> = (props) => {
    const { mutate } = useSWRConfig()
    const [ editMode, setEditMode ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(false)
    let inputRenameRef = useRef<HTMLInputElement>(null)
    let activeAddress: AddressType | null = null

    if (props.wallet) {
        activeAddress = props.wallet.addresses?.reduce((previous, current, index) => {
            if (index === 0) return current
            if (previous.createdAt > current.createdAt) return previous
            else return current
        })
    }

    // resets edit mode when wallet changes
    useEffect(() => {
        setEditMode(false)
    }, [props.wallet])

    const renameWallet = async () => {
        if (props.wallet === undefined) return
        if (inputRenameRef === null || inputRenameRef.current === null) return

        props.wallet.alias = inputRenameRef.current.value

        await fetch('/wallet/rename', {
                method: 'PUT',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    wallet: {
                        name: props.wallet.name,
                        alias: inputRenameRef.current.value
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                mutate('/wallets')
            })
            .catch(error => console.error(error))
    }

    const onLoadMoney = async (value: number) => {
        if (activeAddress) {
            setLoading(true)
            await fetch('/wallet/load', {
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
                })
                .catch((error: any) => {

                })
            setLoading(false)
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
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.5em',  alignItems: 'center' }}>
                            <Icon fontSize="large">credit_card</Icon>
                            <RenameTypography variant="standard" placeholder={props.wallet.alias} inputRef={inputRenameRef}></RenameTypography>
                        </Box>
                        :
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.5em', alignItems: 'center' }}>
                            <Icon fontSize="large">credit_card</Icon>
                            <Typography variant="h5">{props.wallet.alias}</Typography>
                        </Box>
                    }
                    <Fab color="secondary" size="small" onClick={() => {
                        if (editMode) {
                            renameWallet()
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
                                    <LoadingButton onClick={() => onLoadMoney(100000)} loading={loading} loadingPosition="start" startIcon={<Icon>receipt</Icon>} color="secondary" variant="contained">Load Money</LoadingButton>
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