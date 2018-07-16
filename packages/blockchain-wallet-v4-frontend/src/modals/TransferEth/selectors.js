import { selectors } from 'data'
import { lift, head, prop, propOr } from 'ramda'

const extractAddress = addr => prop('addr', head(addr))

export const getData = state => {
  const paymentR = selectors.components.sendEth.getPayment(state)
  const defaultAccountR = selectors.core.kvStore.ethereum
    .getAccounts(state)
    .map(extractAddress)

  const transform = (defaultAccount, payment) => {
    const effectiveBalance = propOr('0', 'effectiveBalance', payment)
    const fee = propOr('0', 'fee', payment)

    return {
      to: defaultAccount,
      effectiveBalance,
      fee
    }
  }

  return lift(transform)(defaultAccountR, paymentR)
}
