import { Card, CardHeader, CardContent, Divider, Autocomplete, Typography, Box, Icon, Button, InputAdornment, TextField, createFilterOptions, Paper, Popper, Fade, Modal } from "@mui/material"
import { LoadingButton } from '@mui/lab'
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
    const [ sending, setSending ] = useState<boolean>(false)
    const [ sendMessage, setSendMessage ] = useState<any | null>(null)
    const [ amountMessage, setAmountMessage ] = useState<string>('')
    const [ recipientMessage, setRecipientMessage ] = useState<string>('')
    let sendButtonRef = useRef<HTMLButtonElement>(null)
    let inputAmountRef = useRef<HTMLInputElement>(null)
    let inputRecipientRef = useRef<HTMLInputElement>(null)
    let anchorAmountRef = useRef<HTMLInputElement>(null)
    let anchorRecipientRef = useRef<HTMLInputElement>(null)
    let inputAmountValue = ''

    const validateNumber = (value: string): boolean => {
        if (isNaN(Number(value))) return false
        return true
    }

    const validateRecipient = (value: string): boolean => {
        if (props.wallet) {
            // does not belong to wallet
            for (const address of props.wallet.addresses) {
                if (value === address.value) {
                    setRecipientMessage('You cannot transfer money to the same wallet!')
                    return false
                }
            }
        }

        if (value.length !== 34) {
            setRecipientMessage('Addresses must be 34 characters long!')
            return false
        }

        setRecipientMessage('')
        return true
    }

    const validateAmount = (value: string): boolean => {
        if (value.length === 0) {
            setAmountMessage('You must specify how much to send!')
            return false
        }

        setAmountMessage('')
        return true
    }

    const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (validateNumber(event.target.value)) {
            inputAmountValue = event.target.value
        } else {
            event.target.value = inputAmountValue
        }
    }

    const onSend = async () => {
        if (inputAmountRef == null || inputAmountRef.current === null) return
        if (inputRecipientRef === null || inputRecipientRef.current === null) return

        let error = false;

        if (!validateAmount(inputAmountRef.current.value)) {
            error = true
        }

        if (!validateRecipient(inputRecipientRef.current.value)) {
            error = true
        }

        if (error) return

        setAmountMessage('')
        setRecipientMessage('')
        
        setSending(true)

        await fetch('/transaction/send', {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    wallet: {
                        name: props.wallet!.name
                    },
                    recipient: {
                        address: inputRecipientRef.current.value
                    },
                    amount: parseInt(inputAmountRef.current.value)
                })
            })
            .then(async (response) => {
                const data = await response.json()
                mutate('/wallets')
                mutate('/addresses')
                setSendMessage({...data, icon: response.ok ? { name: 'check_circle', color: '#66bb6a' } : { name: 'error', color: '#f44336' }})
            })
            .catch(error => {
                console.error(error)
            })
        
        setSending(false)
    }

    return (
        props.wallet && props.wallet.balance
        ?
        <Card elevation={6}>
            <CardHeader 
                title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>swap_horizontal</Icon> Send Money</Typography>
                </Box>}
            />
            <Divider />
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
                    <Paper sx={{ backgroundColor: 'secondary.light', border: '1px solid', borderColor: '#00000030', display: 'flex', flexDirection: 'column', gap: '1em', padding: '1em' }}>
                        <Typography variant="h6">{props.wallet.alias}</Typography>
                        <Box sx={{ backgroundColor: '#ffffff', border: '1px solid', borderColor: '#00000030', width: '15rem', height: '100%', padding: '1em' }}>
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
                        <Paper sx={{ backgroundColor: 'secondary.light', border: '1px solid', borderColor: '#00000030', display: 'flex', flexDirection: 'column', gap: '1em', padding: '1em' }}>
                            <Typography variant="h6">Recipient's Address</Typography>
                            <Autocomplete
                                freeSolo
                                ref={anchorRecipientRef}
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
                                        onFocus={() => setRecipientMessage('')}
                                        inputRef={inputRecipientRef}
                                        error={recipientMessage === '' ? false: true}
                                        placeholder="Example: BudvGp9KHE9fA34bSPsgaMsRwYkUbTGebb"
                                        sx={{ backgroundColor: '#ffffff' }}
                                    />
                                }}
                            />
                            <Popper open={recipientMessage === '' ? false : true} anchorEl={anchorRecipientRef.current} placement={"bottom-start"} transition disablePortal sx={{ zIndex: 2 }}>
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper sx={{ padding: '0.5em' }}>
                                        <Typography sx={{ color: "#f44336" }}>{recipientMessage}</Typography>
                                    </Paper>
                                </Fade>
                            )}
                            </Popper>
                        </Paper>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em', padding: '0' }}>
                            <Typography variant="h6">Send Amount</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em' }}>
                                <TextField
                                    onFocus={() => setAmountMessage('')}
                                    ref={anchorAmountRef}
                                    inputRef={inputAmountRef}
                                    error={amountMessage === '' ? false : true}
                                    size="small"
                                    placeholder="0"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        endAdornment: <InputAdornment position="end">BCY</InputAdornment>
                                    }}
                                    onChange={onChangeAmount}
                                    sx={{ width: '100%' }}
                                />
                                <Popper 
                                    open={amountMessage === '' ? false : true}
                                    anchorEl={anchorAmountRef.current}
                                    placement={"bottom-start"}
                                    transition
                                    disablePortal
                                    modifiers={[
                                        {
                                            name: 'flip',
                                            enabled: false,
                                        }
                                    ]}
                                    sx={{ zIndex: 2 }}>
                                    {({ TransitionProps }) => (
                                        <Fade {...TransitionProps} timeout={350}>
                                            <Paper sx={{ padding: '0.5em' }}>
                                                <Typography sx={{ color: "#f44336" }}>{amountMessage}</Typography>
                                            </Paper>
                                        </Fade>
                                    )}
                                </Popper>
                                <Box>
                                    <LoadingButton ref={sendButtonRef} onClick={() => onSend()} loading={sending} loadingPosition="end" endIcon={<Icon>arrow_forward</Icon>} color="secondary" variant="contained">Send</LoadingButton>
                                    <Modal
                                        open={sendMessage ? true : false}
                                        aria-labelledby="parent-modal-title"
                                        aria-describedby="parent-modal-description"
                                        >
                                        <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40rem' }}>
                                            <CardHeader 
                                                title={<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
                                                    <Icon sx={{ color: `${sendMessage?.icon?.color}`, fontSize: '10rem' }}>{sendMessage?.icon?.name}</Icon>
                                                    <Typography id="parent-modal-title" variant="h3" align="center">{sendMessage?.title}</Typography>
                                                </Box>} />
                                            <Divider />
                                            <CardContent id="parent-modal-description" sx={{ display: 'flex', flexDirection: 'column', gap: '1em'}}>
                                                { sendMessage?.messages?.map((message: string, index: number) => {
                                                    return <Typography key={index}>{message}</Typography>
                                                }) }
                                                <Button onClick={() => setSendMessage(null)} color="secondary" variant="contained" sx={{ margin: 'auto' }}>Close</Button>
                                            </CardContent>
                                        </Card>
                                    </Modal>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
        :
        null
    )
}