import { ThemeProvider } from '@emotion/react';
import { Container, createTheme, Icon, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import './App.scss';
import { Navigation, Receive, Send, WalletCollection, Wallet } from './components';
import { Dashboard } from './layouts';
import { WalletType } from "../types";
import background from '../assets/images/background.png';
import useSWR from 'swr';
import styled from '@emotion/styled';

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

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CustomizedContainer = styled(Container)`
  position: relative;
  overflow: clip;
  z-index: 1;

  &::before {
    content: "";
    position: fixed;
    background: url('${background}');
    z-index: 2;
    width: 2000px;
    height: 2000px;
    opacity: 0.2;
    bottom: 50%;
    left: 50%;
    transform: scale(100%);
    animation: animationBefore 120s linear infinite;
  }

  &::after {
    content: "";
    position: fixed;
    background: url('${background}');
    z-index: 2;
    width: 2000px;
    height: 2000px;
    opacity: 0.1;
    bottom: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(50%) scale(300%);
    animation: animationAfter 120s linear infinite;
  }

  & > * {
    position: relative;
    z-index: 3;
  }
`

function App() {
  const [wallets, setWallets] = useState<WalletType[]>([
    { name: "My Wallet 1", address: "19jJyiC6DnKyKvPg38eBE8R6yCSXLLEjqw", balanceDollars: 5000, balanceCents: 0 },
    { name: "My Wallet 2", address: "8R6yg3LECSDnKyKvPg38ejAS2g3LE62adf", balanceDollars: 1234, balanceCents: 32 },
    { name: "My Wallet 3", address: "8R6yg3LECSDnKyKvPg38ejAS2g3LE62adf", balanceDollars: 43672, balanceCents: 71 },
    { name: "My Wallet 4", address: "8R6yg3LECSDnKyKvPg38ejAS2g3LE62adf", balanceDollars: 132, balanceCents: 33 },
    { name: "My Wallet 5", address: "8R6yg3LECSDnKyKvPg38ejAS2g3LE62adf", balanceDollars: 6231, balanceCents: 62 },
  ])
  const [walletIndex, setWalletIndex] = useState<number>(0);
  const { data, error } = useSWR('/address', fetcher);

  const onChangeActiveWallet = (index: number) => {
    setWalletIndex(index)
  }

  const onAddWallet = () => {
    const wallet: WalletType = {
      name: `My Wallet ${wallets.length + 1}`,
      address: "19jJyiC6DnKyKvPg38eBE8R6yCSXLLEjqw",
      balanceDollars: 0,
      balanceCents: 0
    }
    setWallets([...wallets, wallet])
  }

  let recipients = [
    { address: 'kl427JSD3jAS262adfomq1j0FkoPg3LEb2' },
    { address: '8R6yg3LECSDnKyKvPg38ejAS2g3LE62adf' },
    { address: 'g3LECSDnKyKvPg38ejAS2g3LE6asd23IOJ' },
    { address: '427JSD3jAS262adfomq1j0FkoPg3LEb2af' },
    { address: '9jJyiC6DnKyKvPg38eBE8R6yCSXLL123JI' },
    { address: '9jJyiC6DnKAFvPg38eBE8R6yCSXLL123JI' },
  ]

  return (
    <ThemeProvider theme={theme}>
      <CustomizedContainer maxWidth={false} disableGutters={true} sx={{ minHeight: '100vh', backgroundColor: 'primary.dark', padding: '3em 0' }}>
        <Container maxWidth="lg">
          <Navigation />
          <Dashboard 
            tabs={[
              { label: "Account View" },
              { label: "Send Money" },
              { label: "Receive Money" }
            ]}
            tabPanels={[
              { content: 
                <Stack direction="column" spacing={4}>
                  <Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> Account View</Typography>
                  <WalletCollection wallets={wallets} onChangeActiveWallet={onChangeActiveWallet} onAddWallet={onAddWallet} />
                  <Wallet wallet={wallets[walletIndex]} onRename={() => {}} onLoadMoney={() => {}} />
                </Stack>
              },
              { content: 
                <Stack direction="column" spacing={4}>
                  <Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon fontSize="large" sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> Send Money</Typography>
                  <WalletCollection wallets={wallets} onChangeActiveWallet={onChangeActiveWallet} />
                  <Send recipients={recipients}/>
                </Stack>
              },
              { content: 
                <Stack direction="column" spacing={4}>
                  <Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon fontSize="large" sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> Receive Money</Typography>
                  <WalletCollection wallets={wallets} onChangeActiveWallet={onChangeActiveWallet} />
                  <Receive />
                </Stack>
              }
            ]}
          />
        </Container>
      </CustomizedContainer>
    </ThemeProvider>
  );
}

export default App;