import { length } from 'ramda'
import { selectors } from 'data'

export const getData = state => ({
  bchAccountsLength: length(
    selectors.core.kvStore.bch.getAccounts(state).getOrElse([])
  )
})
