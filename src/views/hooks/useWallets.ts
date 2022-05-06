import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useWallets() {
    const { data, error } = useSWR('/wallets', fetcher);
  
    return {
      data: data,
      error: error
    }
}