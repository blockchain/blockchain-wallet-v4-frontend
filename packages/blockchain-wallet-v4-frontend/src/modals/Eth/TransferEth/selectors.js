import { head, lift, prop, propOr } from 'ramda'
import { selectors } from 'data'

const extractAddress = addr => prop('addr', head(addr))

export const getData = state => {
  const paymentR = selectors.components.sendEth.getPayment(state)
  const defaultAccountR = selectors.core.kvStore.eth
    .getAccounts(state)
    .map(extractAddress)

  const transform = (ethAddr, payment) => ({
    ethAddr,
    ethBalance: propOr('0', 'effectiveBalance', payment),
    txFee: propOr('0', 'fee', payment)
  })

  return lift(transform)(defaultAccountR, paymentR)
}
