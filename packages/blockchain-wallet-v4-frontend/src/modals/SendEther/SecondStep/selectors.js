import { selectors } from 'data'
import { utils } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const paymentR = selectors.components.sendEth.getPayment(state)

  const from = from => {
    switch (from.type) {
      case 'ACCOUNT':
        return selectors.core.kvStore.ethereum.getAccountLabel(state, from.address).getOrElse(from.address)
      default:
        return from.address
    }
  }

  const transform = payment => ({
    message: payment.description,
    fromAddress: from(payment.from),
    toAddress: payment.to,
    amount: payment.amount,
    fee: payment.fee,
    total: utils.ethereum.calculateTransactionAmount(payment.amount, payment.fee)
  })

  return paymentR.map(transform)
}
