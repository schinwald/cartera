import { ThemeProvider } from '@emotion/react';
import { Avatar, Box, Button, Card, CardContent, CardHeader, Container, createTheme, Divider, Grid, Icon, Chip, Stack, TextField, Typography, Paper, Fab, Tabs, Tab, IconButton } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { ReactComponent as Logo } from './assets/logo.svg';
import headshot from "./assets/avatar.jpg";
import qrcode from "./assets/qr-code.png";
import './App.scss';

const theme = createTheme({
  palette: {
    primary: {
      light: "#f3e5f5",
      main: "#824e94",
      dark: "#610980",
      contrastText: "#ffffff"
    },
    secondary: {
      light: "#ffb74d",
      main: "#ffa726",
      dark: "#f57c00",
      contrastText: "#000000"
    },
  },
});

function App() {
  let recipients = [
    '19jJyiC6DnKyKvPg38eBE8R6yCSXLLEjqw',
    'kl427JSD3jAS262adfomq1j0FkoPg3LEb2',
    '8R6yg3LECSDnKyKvPg38ejAS2g3LE62adf',
    'g3LECSDnKyKvPg38ejAS2g3LE6asd23IOJ',
    '427JSD3jAS262adfomq1j0FkoPg3LEb2af',
    '9jJyiC6DnKyKvPg38eBE8R6yCSXLL123JI',
    '9jJyiC6DnKAFvPg38eBE8R6yCSXLL123JI',
  ]
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters={true} sx={{
        height: '100vh',
        backgroundColor: 'primary.dark',
        padding: '3em 0'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1em',
          }}>
            <Logo />
            <Box sx={{
              display: 'flex',
              alignItems: 'end',
              gap: '1em'
            }}>
              <Typography color="primary.contrastText" variant='h6'>John Smith</Typography>
              <Avatar alt="Picture of John Smith" src={headshot} sx={{ width: "4rem", height: "4rem" }} />
            </Box>
          </Box>
          <Paper elevation={5} sx={{
            backgroundColor: "primary.main",
            padding: "2em"
          }}>
            <Grid container spacing={4}>
              <Grid item xs={2}>
                <Box sx={{ display: 'flex' }}>
                  <Tabs orientation="vertical" value={0}>
                    <Tab label="Account View" />
                    <Tab label={<Typography color="primary.contrastText">Exchange</Typography>}/>
                  </Tabs>
                </Box>
              {/* <TabPanel value={value} index={0}>
                <Typography color="primary.contrastText">Account View</Typography>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Typography color="primary.contrastText">Exchange</Typography>
              </TabPanel> */}
              </Grid>
              <Grid item xs={10}>
                <Stack direction="column" spacing={4}>
                  <Card>
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
                          <Box sx={{
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}>
                            <Chip label="QR Code" size="small" />
                            <img alt="Sample QR Code" src={qrcode} width={256} height={256} />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader 
                      title={<Box sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}>
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
                            options={recipients}
                            sx={{ width: '100%' }}
                            popupIcon={<Icon>search</Icon>}
                            filterOptions={createFilterOptions({
                              matchFrom: "start",
                              limit: 10
                            })}
                            renderOption={(props, option) => (
                              <Box component="li" sx={{ '& > span': { marginRight: '0.5em' } }} {...props}>
                                <Icon>fingerprint</Icon> {option}
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
                  <Card>
                    <CardHeader 
                      title={<Box sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}>
                          <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>swap_horizontal</Icon> Receive Money</Typography>
                        </Box>}
                    />
                    <Divider />
                    <CardContent>
                      <Button color="secondary" variant="contained" startIcon={<Icon>arrow_forward</Icon>}>Receive</Button>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default App;