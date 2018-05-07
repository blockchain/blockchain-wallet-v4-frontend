import { selectors } from 'data'
import { lift, head, prop } from 'ramda'

const extractAddress = addr => prop('addr', head(addr))

export const getData = state => {
  const paymentR = selectors.components.sendEth.getPayment(state)
  const defaultAccountR = selectors.core.kvStore.ethereum.getAccounts(state).map(extractAddress)

  const transform = (defaultAccount, payment) => {
    const effectiveBalance = prop('effectiveBalance', payment) || '0'
    const fee = prop('fee', payment) || '0'

    return {
      to: defaultAccount,
      effectiveBalance,
      fee
    }
  }

  return lift(transform)(defaultAccountR, paymentR)
}
