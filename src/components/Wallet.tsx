import { Grid, Card, CardHeader, CardContent, IconButton, Icon, Fab, Divider, Box, Typography, Chip, Button } from "@mui/material"
import qrcode from "../assets/images/qr-code.png";

type Props = {
    
}

export const Wallet: React.FC<Props> = (props) => {
    return <Card>
        <CardHeader 
            title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>credit_card</Icon> My Wallet</Typography>
                <Fab color="secondary" size="small"><Icon>edit</Icon></Fab>
            </Box>}
            subheader={<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                <Typography>Address:</Typography>
                <Typography>19jJyiC6DnKyKvPg38eBE8R6yCSXLLEjqw</Typography>
                <IconButton aria-label="copy" size="small">
                    <Icon>content_copy</Icon>
                </IconButton>
            </Box>}
        />
        <Divider />
        <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Chip label="Balance" size="small" />
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em' }}>
                        <Typography color="secondary.dark" variant="h1">$5,000.00</Typography>
                        <Typography variant="h2">BTC</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
                        <Button color="secondary" variant="contained" startIcon={<Icon>receipt</Icon>}>Load Money</Button>
                        <Typography>(This is for testing purposes only!)</Typography>
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