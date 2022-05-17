import { ThemeProvider } from '@emotion/react';
import { Container, createTheme, Icon, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.scss';
import { Navigation, Exchange, WalletCollection, Wallet, Transactions } from './components';
import { Dashboard } from './layouts';
import background from '../assets/images/background.png';
import { useSWRConfig } from 'swr';
import styled from '@emotion/styled';
import { AddressType, TransactionType } from '../types';
import { useWallets, useAddresses } from './hooks';
import { receiveMessageOnPort } from 'worker_threads';

const theme = createTheme({
	palette: {
		primary: {
			light: "#e5dce8",
			main: "#824e94",
			dark: "#610980",
			contrastText: "#ffffff"
		},
		secondary: {
			light: "#fffaf2",
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
    opacity: 0.1;
    bottom: 50%;
    left: 50%;
    transform: scale(100%);
    animation: animationBefore 180s linear infinite;
  }

  &::after {
    content: "";
    position: fixed;
    background: url('${background}');
    z-index: 2;
    width: 2000px;
    height: 2000px;
    opacity: 0.05;
    bottom: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(50%) scale(300%);
    animation: animationAfter 240s linear infinite;
  }

  & > * {
    position: relative;
    z-index: 3;
  }
`

const fetcher = (url: string) => fetch(url).then(res => res.json());

function App() {
	const { mutate } = useSWRConfig()
	const wallets: any = useWallets()
	const addresses: any = useAddresses()
	const [walletIndex, setWalletIndex] = useState<number>(0);

	if (wallets.data) {
		for (let wallet of wallets.data) {
			// consolidate balances to individual wallets
			wallet.balance = wallet.addresses?.map((address: AddressType) => address.balance)
				.reduce((previous: any, current: any) => {
					return {
						confirmed: previous.confirmed + current.confirmed,
						pending: previous.pending + current.pending
					}
				}, { confirmed: 0, pending: 0 })

			// consolidate transactions to individual wallets
			wallet.transactions = wallet.addresses?.map((address: AddressType) => {
					for (const transaction of address.transactions) {
						for (const receiver of transaction.receivers) {
							if (address.value === receiver.address.value) {
								receiver.address.owned = true
							} else {
								receiver.address.owned = false
							}
						}
						for (const sender of transaction.senders) {
							if (address.value === sender.address.value) {
								sender.address.owned = true
							} else {
								sender.address.owned = false
							}
						}
					}
					return address.transactions
				})
				.reduce((previous: TransactionType[], current: TransactionType[], index: number) => {
					return [...previous, ...current]
        		}, [])
				.sort((a: TransactionType, b: TransactionType) => a.ref.localeCompare(b.ref))
				.filter((transaction: TransactionType, index: number, transactions: TransactionType[]) => {
					if (index === 0) return true
					if (transactions[index - 1].ref !== transactions[index].ref) return true
					// transfer owned statuses to previous before dissolving
					for (let r in transactions[index].receivers) {
						if (transactions[index].receivers[r].address.owned === true) {
							transactions[index - 1].receivers[r].address.owned = true
						}
					}
					for (let r in transactions[index].senders) {
						if (transactions[index].senders[r].address.owned === true) {
							transactions[index - 1].senders[r].address.owned = true
						}
					}
					return false
				})
		}
	}

	const onChangeActiveWallet = (index: number) => {
		setWalletIndex(index)
	}

	const onCreateWallet = async () => {
		if (wallets.data) {
			await fetch('/wallet/create?' + new URLSearchParams({ alias: `My Wallet ${wallets.data.length + 1}` }), {
					method: 'POST'
				})
				.then(response => {
					const wallet = {
						alias: `Processing...`
					}
					mutate('/wallets', async () => { wallets.data = [...wallets.data, wallet] }, {
						optimisticData: [...wallets.data, wallet],
						revalidate: true,
						populateCache: false,
						rollbackOnError: true
					})
				})
				.catch(error => {
					console.error(error)
				})
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<CustomizedContainer maxWidth={false} disableGutters={true} sx={{ minHeight: '100vh', backgroundColor: 'primary.dark', padding: '3em 0' }}>
				<Container maxWidth="lg">
					<Navigation />
					{ wallets.data &&
						<Dashboard
							tabs={[
								{ label: "Account" },
								{ label: "Exchange" },
								{ label: "History" }
							]}
							tabPanels={[
								{
									content:
										<Stack direction="column" spacing={4}>
											<Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> Account</Typography>
											<WalletCollection wallets={wallets.data} activeWallet={walletIndex} onChangeActiveWallet={onChangeActiveWallet} onCreateWallet={onCreateWallet} />
											<Wallet wallet={wallets.data[walletIndex]} />
										</Stack>
								},
								{
									content:
										<Stack direction="column" spacing={4}>
											<Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon fontSize="large" sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> Exchange</Typography>
											<WalletCollection wallets={wallets.data} activeWallet={walletIndex} onChangeActiveWallet={onChangeActiveWallet} />
											{ addresses.data && <>
												<Exchange wallet={wallets.data[walletIndex]} recipients={addresses.data} />
											</> }
										</Stack>
								},
								{
									content:
										<Stack direction="column" spacing={4}>
											<Typography color="primary.contrastText" variant="h4" sx={{ borderBottom: '1px solid' }}><Icon fontSize="large" sx={{ verticalAlign: 'middle', fontSize: '1.6em' }}>double_arrow</Icon> History</Typography>
											<WalletCollection wallets={wallets.data} activeWallet={walletIndex} onChangeActiveWallet={onChangeActiveWallet} />
											<Transactions wallet={wallets.data[walletIndex]} />
										</Stack>
								}
							]}
						/>
					}
				</Container>
			</CustomizedContainer>
		</ThemeProvider>
	);
}

export default App;