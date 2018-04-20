import { selectors } from 'data'
import { utils } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const paymentR = selectors.components.sendEth.getPayment(state)

  const from = payment => {
    switch (payment.fromType) {
      case 'FROM.ACCOUNT':
        return selectors.core.kvStore.getAccountLabel(state, payment.address).getOrElse(payment.address)
      default:
        return payment.address
    }
  }

  const transform = payment => ({
    message: payment.description,
    fromAddress: from(payment),
    toAddress: payment.to,
    amount: payment.amount,
    fee: payment.fee,
    total: utils.ethereum.calculateTransactionAmount(payment.amount, payment.fee)
  })

  return paymentR.map(transform)
}
