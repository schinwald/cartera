import { ThemeProvider } from '@emotion/react';
import { Container, createTheme, Icon, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.scss';
import { Navigation, Receive, Send, WalletCollection, Wallet } from './components';
import { Dashboard } from './layouts';
import { WalletType, AddressType } from "../types";
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

const fetcher = (url: string) => fetch(url).then(res => res.json());

function App() {
  const { data: wallets, mutate, error } = useSWR<WalletType[], any>('/wallets', fetcher);
  const [ walletIndex, setWalletIndex ] = useState<number>(0);
  const [ recipients, setRecipients ] = useState<AddressType[]>([]);

  const onChangeActiveWallet = (index: number) => {
    setWalletIndex(index)
  }

  const onCreateWallet = async () => {
    if (wallets) {
      await fetch('/wallet/create?' + new URLSearchParams({ alias: `My Wallet ${wallets.length + 1}` }), { method: 'POST' })
      mutate()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CustomizedContainer maxWidth={false} disableGutters={true} sx={{ minHeight: '100vh', backgroundColor: 'primary.dark', padding: '3em 0' }}>
        <Container maxWidth="lg">
          { wallets && <>
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
                    <WalletCollection wallets={wallets} activeWallet={walletIndex} onChangeActiveWallet={onChangeActiveWallet} onCreateWallet={onCreateWallet} />
                    <Wallet wallet={wallets[walletIndex]} onRename={() => {}} onLoadMoney={() => {}} />
                  </Stack>
                },
                { content: 
                  <Stack direction="column" spacing={4}>
                    <Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon fontSize="large" sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> Send Money</Typography>
                    <WalletCollection wallets={wallets} activeWallet={walletIndex} onChangeActiveWallet={onChangeActiveWallet} />
                    <Send recipients={recipients}/>
                  </Stack>
                },
                { content: 
                  <Stack direction="column" spacing={4}>
                    <Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon fontSize="large" sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> Receive Money</Typography>
                    <WalletCollection wallets={wallets} activeWallet={walletIndex} onChangeActiveWallet={onChangeActiveWallet} />
                    <Receive />
                  </Stack>
                }
              ]}
            />
          </>}
        </Container>
      </CustomizedContainer>
    </ThemeProvider>
  );
}

export default App;