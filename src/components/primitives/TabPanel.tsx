type Props = {
    index: number;
    value: number;
}

export const TabPanel: React.FC<React.PropsWithChildren<Props>> = (props) => {
    return <div 
        role="tabpanel"
        id={`vertical-tabpanel-${props.index}`}
        aria-labelledby={`vertical-tab-${props.index}`}
        hidden={props.value !== props.index}
    >
        {props.children}
    </div>
}