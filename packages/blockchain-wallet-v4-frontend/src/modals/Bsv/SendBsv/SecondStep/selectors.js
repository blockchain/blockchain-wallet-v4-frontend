import { selectors, model } from 'data'

import {
  bsvToLabel,
  bsvFromLabel,
  isBchLegacyAddress
} from 'services/PaymentHelper'

const isSubmitting = selectors.form.isSubmitting(model.components.sendBsv.FORM)

export const getData = state => {
  const paymentR = selectors.components.sendBsv.getPayment(state)

  const transform = payment => {
    const fromLabel = bsvFromLabel(payment, state)
    const toLabel = bsvToLabel(payment, state)
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
