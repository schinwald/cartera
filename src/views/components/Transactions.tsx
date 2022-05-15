import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Collapse, Box, Typography, Paper, Icon } from '@mui/material'
import { TransactionType, WalletType } from '../../types'
import React, { useEffect, useState } from 'react'
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
            <Table aria-label="collapsible table" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '4%' }} />
                        <TableCell align="left" sx={{ width: '52%' }}>Transaction Hash</TableCell>
                        <TableCell align="right" sx={{ width: '12%' }}>Credit</TableCell>
                        <TableCell align="right" sx={{ width: '12%' }}>Debit</TableCell>
                        <TableCell align="center" sx={{ width: '10%' }}>Status</TableCell>
                        <TableCell align="center" sx={{ width: '10%' }}>Refresh</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody key={`${props.wallet.name}`}>
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

    let credit = transaction.senders.filter(sender => sender.address.owned)
        .map((sender: any) => sender.amount)
        .reduce((previous: number, current: number) => previous += current, 0)
    
    let debit = transaction.receivers.filter(receiver => receiver.address.owned)
        .map((receiver: any) => receiver.amount)
        .reduce((previous: number, current: number) => previous += current, 0)
    
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
            <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <Icon>keyboard_arrow_up</Icon> : <Icon>keyboard_arrow_down</Icon>}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row" align="left" sx={{ fontFamily: 'Monospace!important' as 'Monospace' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                    <Icon>receipt</Icon>
                    {transaction.ref.slice(0, 31)}...
                    <Copy text={transaction.ref} placement="right" />
                </Box>
            </TableCell>
            <TableCell align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace' }}>{Math.max(0, credit - debit)}</TableCell>
            <TableCell align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace' }}>{Math.max(0, debit - credit)}</TableCell>
            <TableCell align="center" sx={{ backgroundColor: 'palette.warning.dark' }}>{(transaction.confirmations >= 6) ? 'Confirmed' : 'Pending'}</TableCell>
            <TableCell align="center"><IconButton onClick={() => updateTransaction()}><Icon>refresh</Icon></IconButton></TableCell>
        </TableRow>
        <TableRow sx={{ backgroundColor: "secondary.light" }}>
            <TableCell style={{ padding: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ padding: '1rem 0' }}>
                        <Table size="small" sx={{ tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" sx={{ width: '4%' }}></TableCell>
                                    <TableCell align="left" sx={{ width: '52%' }}>Address</TableCell>
                                    <TableCell align="right" sx={{ width: '12%' }}></TableCell>
                                    <TableCell align="right" sx={{ width: '12%' }}></TableCell>
                                    <TableCell align="center" sx={{ width: '10%' }}></TableCell>
                                    <TableCell align="center" sx={{ width: '10%' }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { transaction.senders.map((sender: any, index: number) => (
                                    <TableRow key={index} sx={{ backgroundColor: (sender.address.owned ? 'secondary.main' : '') }}>
                                        <TableCell align="left"></TableCell>
                                        <TableCell component="th" scope="row" align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                                            <Icon>fingerprint</Icon>
                                            {sender.address.value}
                                            <Copy text={sender.address.value} placement="right" />
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace' }}>{sender.amount}</TableCell>
                                        <TableCell align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace' }}>0</TableCell>
                                        <TableCell align="center">{sender.address.owned ? 'Owned' : null}</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                ))}
                                { transaction.receivers.map((receiver: any, index: number) => (
                                    <TableRow key={index} sx={{ backgroundColor: (receiver.address.owned ? 'secondary.main' : '') }}>
                                        <TableCell align="left"></TableCell>
                                        <TableCell component="th" scope="row" align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                                            <Icon>fingerprint</Icon>
                                            {receiver.address.value}
                                            <Copy text={receiver.address.value} placement="right" />
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace' }}>0</TableCell>
                                        <TableCell align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace' }}>{receiver.amount}</TableCell>
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
                                    <TableCell align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace' }}>0</TableCell>
                                    <TableCell align="right" sx={{ fontFamily: 'Monospace!important' as 'Monospace' }}>{transaction.fees}</TableCell>
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