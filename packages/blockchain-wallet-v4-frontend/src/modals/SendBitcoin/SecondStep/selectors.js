import { selectors } from 'data'
import { btcToLabel, btcFromLabel } from 'services/PaymentHelper'

export const getData = state => {
  const paymentR = selectors.components.sendBtc.getPayment(state)

  const transform = payment => {
    const fromLabel = btcFromLabel(payment, state)
    const toLabel = btcToLabel(payment, state)

    return {
      message: payment.description,
      fromAddress: fromLabel,
      toAddress: toLabel,
      amount: payment.amount[0],
      fee: payment.selection.fee,
      total: payment.selection.fee + payment.amount[0]
    }
  }

  return paymentR.map(transform)
}
