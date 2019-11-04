import { head, lift, prop, propOr } from 'ramda'
import { selectors } from 'data'

const extractAddress = addr => prop('addr', head(addr))

export const getData = state => {
  const paymentR = selectors.components.sendEth.getPayment(state)
  const defaultAccountR = selectors.core.kvStore.eth
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
