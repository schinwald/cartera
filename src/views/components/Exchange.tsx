import { Card, CardHeader, CardContent, Divider, Autocomplete, Typography, Box, Icon, Button, InputAdornment, TextField, createFilterOptions, Paper } from "@mui/material"
import { styled } from "@mui/material"
import { useEffect, useState, useRef } from "react"
import { WalletType } from '../../types'
import Cleave from 'cleave.js'
import { FancyCard } from "./primitives"
import { useSWRConfig } from "swr"

const WalletPaper = styled(Paper)(
    ({ theme }) => `
    position: relative;
    background-color: ${theme.palette.secondary.main};
    &::before {
        content: "";
        position: absolute;
        top: 60%; right: 0%; bottom: 20%; left: 0%;
        background-color: black;
    }
`);

type Props = {
    wallet?: WalletType;
    recipients: string[];
}

export const Exchange: React.FC<Props> = (props) => {
    const { mutate } = useSWRConfig()
    const [ recipient, setRecipient ] = useState<string>('')
    const [ recipientMessage, setRecipientMessage ] = useState<string>('')
    let inputAmountValue = ''
    
    const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!isNaN(Number(`${event.target.value}`))) {
            inputAmountValue = event.target.value
        } else {
            event.target.value = inputAmountValue
        }
    }
    
    const onSend = async () => {
        let inputAmount = document.getElementById('exchange__amount') as HTMLInputElement
        let inputRecipient = document.getElementById('exchange__recipient') as HTMLInputElement

        if (inputAmount === null || inputRecipient == null) return
        if (inputAmount.value.length === 0 || inputRecipient.value.length === 0) return
        
        fetch('/transaction/send', {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    wallet: {
                        name: props.wallet!.name
                    },
                    recipient: {
                        address: inputRecipient.value
                    },
                    amount: parseInt(inputAmount.value)
                })
            })
            .then(response => response.json())
            .then(data => {
                mutate('/wallets')
                mutate('/addresses')
                console.log(data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        props.wallet && props.wallet.balance
        ?
        <FancyCard elevation={6}>
            <CardHeader 
                title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>swap_horizontal</Icon> Send Money</Typography>
                </Box>}
            />
            <Divider />
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
                    <Paper sx={{ border: '1px solid', borderColor: '#00000030', display: 'flex', flexDirection: 'column', gap: '1em', padding: '1em' }}>
                        <Typography variant="h6">{props.wallet.alias}</Typography>
                        <Box sx={{ width: '15rem', height: '100%' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Typography>Balance:</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                                    <Typography color="secondary.dark">${props.wallet.balance.confirmed + props.wallet.balance.pending}</Typography>
                                    <Typography>BCY</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ margin: '0.5em 0' }}/>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Typography>Confirmed:</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                                    <Typography color="secondary.dark">${props.wallet.balance.confirmed}</Typography>
                                    <Typography>BCY</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Typography>Pending:</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                                    <Typography color="secondary.dark">${props.wallet.balance.pending}</Typography>
                                    <Typography>BCY</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'top', gap: '1em', marginTop: '3rem' }}>
                        <Icon>arrow_forward</Icon>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '2em', width: '100%' }}>
                        <Paper sx={{ border: '1px solid', borderColor: '#00000030', display: 'flex', flexDirection: 'column', gap: '1em', padding: '1em' }}>
                            <Typography variant="h6">Recipient's Address</Typography>
                            <Autocomplete
                                id='exchange__recipient'
                                freeSolo
                                size="small"
                                options={props.recipients}
                                sx={{ width: '100%' }}
                                filterOptions={createFilterOptions({
                                    matchFrom: "start",
                                    limit: 10
                                })}
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > span': { marginRight: '0.5em' } }} {...props}>
                                        <Icon>fingerprint</Icon>{option}
                                    </Box>
                                )}
                                renderInput={params => {
                                    return <TextField
                                        {...params}
                                        error={false}
                                        placeholder="Example: BudvGp9KHE9fA34bSPsgaMsRwYkUbTGebb"
                                        helperText={recipientMessage}
                                    />
                                }}
                            />
                        </Paper>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em', padding: '0' }}>
                            <Typography variant="h6">Send Amount</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em' }}>
                                <TextField 
                                    id='exchange__amount'
                                    size="small"
                                    placeholder="0"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        endAdornment: <InputAdornment position="end">BCY</InputAdornment>
                                        
                                    }}
                                    onChange={onChangeAmount}
                                    sx={{ width: '100%' }}
                                />
                                <Box>
                                    <Button onClick={() => onSend()} color="secondary" variant="contained" endIcon={<Icon>arrow_forward</Icon>}>Send</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </FancyCard>
        :
        null
    )
}