import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useQRCode(string: string | undefined) {
    const { data, error } = useSWR(string ? '/transaction?' + new URLSearchParams({ data: string }) : null, fetcher)
  
    return {
      data: data,
      error: error
    }
}