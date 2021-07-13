import { head, lift, prop, propOr } from 'ramda'

import { selectors } from 'data'

// @ts-ignore
const extractAddress = addr => prop('addr', head(addr))

export const getData = state => {
  const paymentR = selectors.modules.transferEth.getPayment(state)
  const defaultAccountR = selectors.core.kvStore.eth
    .getAccounts(state)
    .map(extractAddress)

  const transform = (ethAddr, payment) => ({
    ethAddr,
    ethBalance: propOr('0', 'effectiveBalance', payment) as string,
    txFee: propOr('0', 'fee', payment) as string
  })

  return lift(transform)(defaultAccountR, paymentR)
}
