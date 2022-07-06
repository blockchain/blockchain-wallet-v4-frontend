import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'

import { selectors } from 'data'

import { CountryUSStateHook, USStatesListApiData } from './useCountryList.types'

const useUSStateList: CountryUSStateHook = () => {
  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)

  return useQuery<USStatesListApiData>([api, 'nabu-gateway/countries/US/states'], async () => {
    let states = []
    const response = await fetch(`${api}/nabu-gateway/countries/US/states`)

    if (response) {
      states = await response.json()
    }

    return { states }
  })
}

export default useUSStateList
