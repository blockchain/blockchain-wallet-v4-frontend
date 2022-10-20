import { useSelector } from 'react-redux'
import axios from 'axios'
import queryString from 'query-string'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const ApiHelper = (url: string, params: any) => {
  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)

  const nabuToken = useSelector((state: RootState) =>
    selectors.modules.profile.getUserApiToken(state)
  )

  return axios.get(`${api}/nabu-gateway/${url}${queryString.stringify(params)}`, {
    headers: { authorization: `Bearer ${nabuToken}` }
  })
}

export default ApiHelper
