import { selectors } from 'data'
import { ethFromLabel } from 'services/PaymentHelper'
import { utils } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const paymentR = selectors.components.sendEth.getPayment(state)

  const transform = payment => {
    const fromLabel = ethFromLabel(payment, state)
    const toLabel = payment.to.label || payment.to.address

    return {
      description: payment.description,
      fromAddress: fromLabel,
      toAddress: toLabel,
      amount: payment.amount,
      fee: payment.fee,
      total: utils.ethereum.calculateTransactionAmount(
        payment.amount,
        payment.fee
      )
    }
  }

  return paymentR.map(transform)
}
