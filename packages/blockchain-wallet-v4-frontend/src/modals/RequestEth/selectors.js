import { selectors } from 'data'
import { head, prop, map } from 'ramda'
import { formValueSelector } from 'redux-form'
import { Remote } from 'blockchain-wallet-v4/src'

const extractAddress = addr => prop('addr', head(addr))

export const getData = state => {
  const to = formValueSelector('requestEther')(state, 'to')
  return (
    Remote.of(prop('address', to)) ||
    selectors.core.kvStore.ethereum.getAccounts(state).map(extractAddress)
  )
}

export const getInitialValues = state => {
  const toDropdown = map(x => ({ text: x.label, value: x }))
  const balancesR = selectors.core.common.eth
    .getAccountBalances(state)
    .map(toDropdown)
  return { to: balancesR.data[0].value, coin: 'ETH' }
}
