import { Card, CardHeader, CardContent, Divider, Autocomplete, Typography, Box, Icon, Button, Grid, TextField, createFilterOptions } from "@mui/material"

type Props = {
    recipients: {
        address: string
    }[]
}

export const Send: React.FC<Props> = (props) => {
    return <Card elevation={6}>
        <CardHeader 
            title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>swap_horizontal</Icon> Send Money</Typography>
            </Box>}
        />
        <Divider />
        <CardContent>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <Autocomplete
                id="search-recipients"
                size="small"
                options={props.recipients}
                sx={{ width: '100%' }}
                popupIcon={<Icon>search</Icon>}
                filterOptions={createFilterOptions({
                    matchFrom: "start",
                    limit: 10
                })}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > span': { marginRight: '0.5em' } }} {...props}>
                        <Icon>fingerprint</Icon>{option.address}
                    </Box>
                )}
                renderInput={(params) => <TextField {...params} label="Search Recipients" />}
                />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{
                display: 'inline-flex',
                gap: '1em',
                }}>
                <TextField variant="standard" />
                <Button color="secondary" variant="contained" endIcon={<Icon>arrow_forward</Icon>}>Send</Button>
                </Box>
            </Grid>
            </Grid>
        </CardContent>
    </Card>
}