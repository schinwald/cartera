import { Card } from "@mui/material"
import { styled } from "@mui/material"

export const FancyCard = styled(Card)(
    ({ theme }) => `
    position: relative;
    &::before {
        content: "";
        z-index: 4;
        position: absolute;
        top: 0%; right: 0%; bottom: 0%; left: 0%;
        background-color: ${theme.palette.primary.main};
        opacity: 0.15;
    }
    &::after {
        content: "";
        position: absolute;
        z-index: 4;
        top: 0%; right: 0%; bottom: 0%; left: 0%;
        clip-path: ellipse(100% 50% at 30% 15%);
        background-color: rgba(255, 255, 255);
    }
    & > * {
        position: relative;
        z-index: 5;
    }
`)