import { Grid, Card, CardHeader, CardContent, Icon, Fab, Divider, Box, Typography, Chip, Button } from "@mui/material"
import { useState } from "react";
import qrcode from "../assets/images/qr-code.png";
import { Copy } from "./primitives";
import { WalletType } from "../types";
import AnimatedNumber from "react-awesome-animated-number";

type Props = WalletType;

export const Wallet: React.FC<Props> = (props) => {

    return <Card elevation={6}>
        <CardHeader 
            title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>credit_card</Icon> {props.name}</Typography>
                <Fab color="secondary" size="small"><Icon>edit</Icon></Fab>
            </Box>}
        />
        <Divider />
        <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <Chip label="Balance" size="small" />
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em' }}>
                        <Typography color="secondary.dark" variant="h1" sx={{ display: 'flex' }}>
                            $
                            <AnimatedNumber value={props.balanceDollars}
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
                            .
                            <AnimatedNumber value={props.balanceCents}
                                style={{
                                    transition: '0.8s ease-out',
                                    transitionProperty: 'background-color, color, opacity',
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    overflowY: 'hidden',
                                }}
                                size={96}
                                hasComma={false}
                                minDigits={2}
                                duration={300}/>
                        </Typography>
                        <Typography variant="h2">BTC</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                            <Typography><Icon sx={{ verticalAlign: 'middle' }}>fingerprint</Icon>{props.address}</Typography>
                            <Copy text={props.address} placement="right" />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em', padding: "0.5em 0.5em" }}>
                            <Button color="secondary" variant="contained" startIcon={<Icon>receipt</Icon>}>Load Money</Button>
                        </Box>
                    </Box>
                </Box>
                </Grid>
                <Grid item xs={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Chip label="QR Code" size="small" />
                    <img alt="Sample QR Code" src={qrcode} width={256} height={256} />
                </Box>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
}