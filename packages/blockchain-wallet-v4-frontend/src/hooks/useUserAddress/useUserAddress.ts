import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import axios from 'axios'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { UserAddressData, UserAddressHook } from './useUserAddress.types'

const useUserAddress: UserAddressHook = (searchText: string, country?: string) => {
  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)

  const nabuToken = useSelector((state: RootState) =>
    selectors.modules.profile.getUserApiToken(state)
  )
  let countryParams = ''
  if (country) {
    countryParams = `&country_code=${country}`
  }

  const urlForAddresses = `/nabu-gateway/address-capture/find?text=${searchText}${countryParams}`

  return useQuery<UserAddressData>([api, urlForAddresses, searchText], async () => {
    let addresses = []
    const response = await axios.get(`${api}${urlForAddresses}`, {
      headers: { authorization: `Bearer ${nabuToken}` }
    })

    if (response.data) {
      addresses = response.data
    }

    return { addresses }
  })
}

export default useUserAddress
