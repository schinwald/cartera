import { styled } from "@mui/material";
import { Box, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { TabPanel } from '../components/primitives';

const CustomPaper = styled(Paper)(
	({ theme }) => `
	background: ${theme.palette.primary.main + 'cf'};
	background
`)

type Props = {
    tabs: {
		label: string;
	}[];
    tabPanels: {
		content: React.ReactNode;
	}[];
}

export const Dashboard: React.FC<Props> = (props) => {
	const [ value, setValue ] = useState(0);
	
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	}

    return <CustomPaper elevation={18} sx={{ backgroundColor: "primary.main", padding: "2em" }}>
		<Grid container spacing={4}>
			<Grid item xs={2}>
				<Box sx={{ display: 'flex', justifyContent: 'end' }}>
					<Tabs orientation="vertical" indicatorColor="secondary" value={value} onChange={handleChange}>
						{ props.tabs && props.tabs.map((tab, index) => {
							return (
								<Tab key={index} sx={{ textTransform: 'none', alignItems: 'end' }}
									id={`vertical-tab-${index}`}
									aria-controls={`vertical-tabpanel-${index}`}
									label={<Typography color="secondary">
										{tab.label}
									</Typography>}
								/>
							)
						}) }
					</Tabs>
				</Box>
			</Grid>
			<Grid item xs={10}>
				{ props.tabPanels && props.tabPanels.map((tabPanel, index) => {
					return (
						<TabPanel key={index} value={value} index={index}>
							{tabPanel.content}
						</TabPanel>
					)
				}) }
			</Grid>
		</Grid>
    </CustomPaper>
}