import { selectors } from 'data'
import { lift, head, prop } from 'ramda'

const extractAddress = addr => prop('addr', head(addr))

export const getData = state => {
  const defaultAccountR = selectors.core.kvStore.ethereum.getAccounts(state).map(extractAddress)
  const legacyAccountR = selectors.core.kvStore.ethereum.getLegacyAccount(state)

  const transform = (defaultAccount, legacyAccount) => ({
    to: defaultAccount,
    from: legacyAccount
  })

  return lift(transform)(defaultAccountR, legacyAccountR)
}
