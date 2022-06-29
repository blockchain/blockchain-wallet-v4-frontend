import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'

import { selectors } from 'data'

import { CountryListApiData, CountryListHook } from './useCountryList.types'

const useCountryList: CountryListHook = ({ scope }) => {
  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)

  return useQuery<CountryListApiData>([api, 'nabu-gateway/countries', scope], async () => {
    let countries = []
    const response = await fetch(`${api}/nabu-gateway/countries?scope=${scope}`)

    if (response) {
      countries = await response.json()
    }

    return { countries }
  })
}

export default useCountryList
