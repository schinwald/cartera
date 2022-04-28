import { ThemeProvider } from '@emotion/react';
import { Container, createTheme, Icon, Stack, Typography } from '@mui/material';
import './App.scss';
import { Navigation, Receive, Send, Wallet } from './components';
import { Dashboard } from './layouts';

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
    { address: '19jJyiC6DnKyKvPg38eBE8R6yCSXLLEjqw' },
    { address: 'kl427JSD3jAS262adfomq1j0FkoPg3LEb2' },
    { address: '8R6yg3LECSDnKyKvPg38ejAS2g3LE62adf' },
    { address: 'g3LECSDnKyKvPg38ejAS2g3LE6asd23IOJ' },
    { address: '427JSD3jAS262adfomq1j0FkoPg3LEb2af' },
    { address: '9jJyiC6DnKyKvPg38eBE8R6yCSXLL123JI' },
    { address: '9jJyiC6DnKAFvPg38eBE8R6yCSXLL123JI' },
  ]

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters={true} sx={{ height: '100vh', backgroundColor: 'primary.dark', padding: '3em 0' }}>
        <Container maxWidth="lg">
          <Navigation />
          <Dashboard 
            tabs={[
              { label: "Account View" },
              { label: "Exchange" }
            ]}
            tabPanels={[
              { content: 
                <Stack direction="column" spacing={4}>
                  <Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> Account View</Typography>
                  <Wallet />
                </Stack>
              },
              { content: 
                <Stack direction="column" spacing={4}>
                <Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon fontSize="large" sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> Exchange</Typography>
                  <Send recipients={recipients}/>
                  <Receive />
                </Stack>
              }
            ]}
          />
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default App;