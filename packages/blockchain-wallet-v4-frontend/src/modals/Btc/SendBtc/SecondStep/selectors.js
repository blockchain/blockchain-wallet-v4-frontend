import { btcFromLabel, btcToLabel } from 'services/PaymentHelper'
import { model, selectors } from 'data'

const isSubmitting = selectors.form.isSubmitting(model.components.sendBtc.FORM)

export const getData = state => {
  const paymentR = selectors.components.sendBtc.getPayment(state)

  const transform = payment => {
    const fromLabel = btcFromLabel(payment, state)
    const toLabel = btcToLabel(payment, state)

    return {
      submitting: isSubmitting(state),
      description: payment.description,
      fromAddress: fromLabel,
      toAddress: toLabel,
      amount: payment.amount[0],
      fee: payment.selection.fee,
      total: payment.selection.fee + payment.amount[0]
    }
  }

  return paymentR.map(transform)
}
