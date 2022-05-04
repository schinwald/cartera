import { Grid, Card, CardHeader, CardContent, Icon, Fab, Divider, Box, Typography, Chip, Button, Paper, TableContainer, Table, TableHead, TableCell } from "@mui/material"
import { styled } from "@mui/material"
import { useState } from "react";
import { Copy } from "./primitives";
import { WalletType, AddressType } from "../../types";
import AnimatedNumber from "react-awesome-animated-number";
import { useSWRConfig } from 'swr';
import fetch from 'isomorphic-fetch';

type Props = {
    
}

export const TransactionHistory: React.FC<Props> = (props) => {

    return null
    // return <Card elevation={6}>
    //     <CardHeader 
    //         title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
    //             <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>history</Icon> History</Typography>
    //         </Box>}
    //     />
    //     <Divider />
    //     <CardContent>
    //         <TableContainer component={Paper}>
    //             <Table aria-label="collapsible table">
    //                 <TableHead>
    //                     <TableRow>
    //                         <TableCell />
    //                         <TableCell align="left">Address</TableCell>
    //                         <TableCell align="left">Credit</TableCell>
    //                         <TableCell align="left">Debit</TableCell>
    //                     </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                 {rows.map((row) => (
    //                     <Row key={row.name} row={row} />
    //                 ))}
    //                 </TableBody>
    //             </Table>
    //         </TableContainer>
    //         { 
    //             <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
    //                 <TableCell>
    //                 <IconButton
    //                     aria-label="expand row"
    //                     size="small"
    //                     onClick={() => setOpen(!open)}
    //                 >
    //                     {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    //                 </IconButton>
    //                 </TableCell>
    //                 <TableCell component="th" scope="row">
    //                 {row.name}
    //                 </TableCell>
    //                 <TableCell align="right">{row.calories}</TableCell>
    //                 <TableCell align="right">{row.fat}</TableCell>
    //                 <TableCell align="right">{row.carbs}</TableCell>
    //                 <TableCell align="right">{row.protein}</TableCell>
    //             </TableRow>
    //             <TableRow>
    //                 <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
    //                 <Collapse in={open} timeout="auto" unmountOnExit>
    //                     <Box sx={{ margin: 1 }}>
    //                     <Typography variant="h6" gutterBottom component="div">
    //                         History
    //                     </Typography>
    //                     <Table size="small" aria-label="purchases">
    //                         <TableHead>
    //                         <TableRow>
    //                             <TableCell></TableCell>
    //                             <TableCell>Customer</TableCell>
    //                             <TableCell align="right">Amount</TableCell>
    //                             <TableCell align="right">Total price ($)</TableCell>
    //                         </TableRow>
    //                         </TableHead>
    //                         <TableBody>
    //                             {row.history.map((historyRow) => (
    //                             <TableRow key={historyRow.date}>
    //                             <TableCell component="th" scope="row">
    //                                 {historyRow.date}
    //                             </TableCell>
    //                             <TableCell>{historyRow.customerId}</TableCell>
    //                             <TableCell align="right">{historyRow.amount}</TableCell>
    //                             <TableCell align="right">
    //                                 {Math.round(historyRow.amount * row.price * 100) / 100}
    //                             </TableCell>
    //                             </TableRow>
    //                         ))}
    //                         </TableBody>
    //                     </Table>
    //                     </Box>
    //                 </Collapse>
    //                 </TableCell>
    //             </TableRow>
    //         }
    //     </CardContent>
    // </Card>
}