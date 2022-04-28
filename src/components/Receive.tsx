import { Box, Button, Card, CardContent, CardHeader, Divider, Icon, Typography } from "@mui/material"

type Props = {
    
}

export const Receive: React.FC<Props> = (props) => {
    return <Card>
        <CardHeader 
            title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>swap_horizontal</Icon> Receive Money</Typography>
            </Box>}
        />
        <Divider />
        <CardContent>
            <Button color="secondary" variant="contained" startIcon={<Icon>arrow_forward</Icon>}>Receive</Button>
        </CardContent>
    </Card>
}