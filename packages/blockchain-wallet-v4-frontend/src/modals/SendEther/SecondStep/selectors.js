import { selectors } from 'data'
import { ethFromLabel } from 'services/PaymentHelper'
import { utils } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const paymentR = selectors.components.sendEth.getPayment(state)

  const transform = payment => {
    const fromLabel = ethFromLabel(payment, state)

    return {
      message: payment.description,
      fromAddress: fromLabel,
      toAddress: payment.to,
      amount: payment.amount,
      fee: payment.fee,
      total: utils.ethereum.calculateTransactionAmount(payment.amount, payment.fee)
    }
  }

  return paymentR.map(transform)
}
