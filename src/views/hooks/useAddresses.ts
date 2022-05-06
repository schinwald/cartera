import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useAddresses() {
    const { data, error } = useSWR('/addresses', fetcher);
  
    return {
      data: data,
      error: error
    }
}