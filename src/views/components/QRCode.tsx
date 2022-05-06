import useSWR, { useSWRConfig } from 'swr';
import sample1 from '../../assets/images/qrcode-1.png' 
import sample2 from '../../assets/images/qrcode-2.png' 
import fetch from 'isomorphic-fetch';
import { useQRCode } from '../hooks';

type Props = {
    data?: string;
    alt: string;
    size: number;
}

export const QRCode: React.FC<Props> = (props) => {
    const qrcode: any = useQRCode(props.data)

    return (
        qrcode.data
        ?
        <img alt={props.alt} src={qrcode.data.url} width={props.size} height={props.size} />
        :
        <img src={sample1} width={props.size} height={props.size} />
    )
}