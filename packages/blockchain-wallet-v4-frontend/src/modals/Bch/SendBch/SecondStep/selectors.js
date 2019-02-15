import { selectors, model } from 'data'
import {
  bchToLabel,
  bchFromLabel,
  isBchLegacyAddress
} from 'services/PaymentHelper'

const isSubmitting = selectors.form.isSubmitting(model.components.sendBch.FORM)

export const getData = state => {
  const paymentR = selectors.components.sendBch.getPayment(state)

  const transform = payment => {
    const fromLabel = bchFromLabel(payment, state)
    const toLabel = bchToLabel(payment, state)
    const isLegacy = isBchLegacyAddress(payment, state)

    return {
      submitting: isSubmitting(state),
      description: payment.description,
      fromAddress: fromLabel,
      toAddress: toLabel,
      amount: payment.amount[0],
      fee: payment.selection.fee,
      total: payment.selection.fee + payment.amount[0],
      isLegacy: isLegacy
    }
  }

  return paymentR.map(transform)
}
