import useSWR, { useSWRConfig } from 'swr';
import sample1 from '../../assets/images/qrcode-1.png' 
import sample2 from '../../assets/images/qrcode-2.png' 
import fetch from 'isomorphic-fetch';

type Props = {
    data?: string;
    alt: string;
    size: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const QRCode: React.FC<Props> = (props) => {
    const qrcode: any = useSWR(props.data ? "/qrcode?" + new URLSearchParams({ data: props.data }) : null, fetcher);

    return (
        qrcode.data
        ?
        <img alt={props.alt} src={qrcode.data.url} width={props.size} height={props.size} />
        :
        <img src={sample1} width={props.size} height={props.size} />
    )
}