import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Collapse, Box, Typography, Paper, Icon } from '@mui/material'
import { TransactionType, WalletType } from '../../types'
import React, { useState } from 'react'
import { Copy } from './primitives'
import fetch from 'isomorphic-fetch'
import { useSWRConfig } from 'swr'

type Props = {
    wallet: WalletType
}

export const Transactions: React.FC<Props> = (props) => {

    return (
        props.wallet && props.wallet.transactions
        ?
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align="left">Transaction Hash</TableCell>
                        <TableCell align="center">Credit</TableCell>
                        <TableCell align="center">Debit</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Refresh</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { props.wallet.transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((transaction: TransactionType, index: number) => (
                        <TransactionRow key={index} transaction={transaction} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        :
        null
    )
}

type TransactionRowProps = {
    transaction: TransactionType;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
    const { mutate } = useSWRConfig()
    const [ open, setOpen ] = useState(false);
    let credit = transaction.senders.filter(sender => sender.address.owned).map((sender: any) => sender.amount).reduce((previous: number, current: number) => previous += current, 0)
    let debit = transaction.receivers.filter(receiver => receiver.address.owned).map((receiver: any) => receiver.amount).reduce((previous: number, current: number) => previous += current, 0)
    
    const updateTransaction = async () => {
        await fetch(`/transaction`, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    ref: transaction.ref
                })
            })
            .then(response => {
                mutate('/wallets')
                mutate('/addresses')
            })
            .catch(error => console.error(error))
    }

    return <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell sx={{ minWidth: '34px' }}>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <Icon>keyboard_arrow_up</Icon> : <Icon>keyboard_arrow_down</Icon>}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row" align="left" sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                    <Icon>receipt</Icon>
                    {transaction.ref.slice(0, 40)}...
                    <Copy text={transaction.ref} placement="right" />
                </Box>
            </TableCell>
            <TableCell align="right" sx={{ minWidth: '80.167px' }}>{Math.max(0, credit - debit)}</TableCell>
            <TableCell align="right" sx={{ minWidth: '80.167px' }}>{Math.max(0, debit - credit)}</TableCell>
            <TableCell align="center" sx={{ backgroundColor: 'palette.warning.dark', minWidth: '51.8px' }}>{(transaction.confirmations >= 6) ? 'Confirmed' : 'Pending'}</TableCell>
            <TableCell align="center" sx={{ minWidth: '49.5833px' }}><IconButton onClick={() => updateTransaction()}><Icon>refresh</Icon></IconButton></TableCell>
        </TableRow>
        <TableRow sx={{ backgroundColor: "secondary.light" }}>
            <TableCell style={{ padding: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ padding: '1rem 0' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" sx={{ minWidth: '34px' }}></TableCell>
                                    <TableCell align="left" sx={{ width: '100%' }}>Address</TableCell>
                                    <TableCell align="right" sx={{ minWidth: '80.167px' }}></TableCell>
                                    <TableCell align="right" sx={{ minWidth: '80.167px' }}></TableCell>
                                    <TableCell align="center" sx={{ minWidth: '51.8px' }}></TableCell>
                                    <TableCell align="center" sx={{ minWidth: '49.5833px' }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { transaction.senders.map((sender: any, index: number) => (
                                    <TableRow key={index} sx={{ backgroundColor: (sender.address.owned ? 'secondary.main' : '') }}>
                                        <TableCell align="left"></TableCell>
                                        <TableCell component="th" scope="row" align="right" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                                            <Icon>fingerprint</Icon>
                                            {sender.address.value}
                                            <Copy text={sender.address.value} placement="right" />
                                        </TableCell>
                                        <TableCell align="right">{sender.amount}</TableCell>
                                        <TableCell align="right">0</TableCell>
                                        <TableCell align="center">{sender.address.owned ? 'Owned' : null}</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                ))}
                                { transaction.receivers.map((receiver: any, index: number) => (
                                    <TableRow key={index} sx={{ backgroundColor: (receiver.address.owned ? 'secondary.main' : '') }}>
                                        <TableCell align="left"></TableCell>
                                        <TableCell component="th" scope="row" align="right" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                                            <Icon>fingerprint</Icon>
                                            {receiver.address.value}
                                            <Copy text={receiver.address.value} placement="right" />
                                        </TableCell>
                                        <TableCell align="right">0</TableCell>
                                        <TableCell align="right">{receiver.amount}</TableCell>
                                        <TableCell align="center">{receiver.address.owned ? 'Owned' : null}</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell align="left"></TableCell>
                                    <TableCell component="th" scope="row" align="right" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                                        <Icon>engineering</Icon>
                                        Service Fees
                                    </TableCell>
                                    <TableCell align="right">0</TableCell>
                                    <TableCell align="right">{transaction.fees}</TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}