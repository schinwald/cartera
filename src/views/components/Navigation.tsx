import { Avatar, Box, Typography } from "@mui/material"
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import headshot from "../../assets/images/avatar.png";

type Props = {
    
}

export const Navigation: React.FC<Props> = (props) => {
    return <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '1em' }}>
        <Logo />
        <Box sx={{ display: 'flex', alignItems: 'end', gap: '1em' }}>
            <Typography color="primary.contrastText" variant='h6'>John Smith</Typography>
            <Avatar alt="Picture of John Smith" src={headshot} sx={{ width: "4rem", height: "4rem" }} />
        </Box>
    </Box>
}