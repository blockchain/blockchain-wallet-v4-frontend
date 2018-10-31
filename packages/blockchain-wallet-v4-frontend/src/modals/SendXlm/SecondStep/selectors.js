import { selectors, model } from 'data'
import { xlmFromLabel } from 'services/PaymentHelper'
import { utils } from 'blockchain-wallet-v4/src'
const isSubmitting = selectors.form.isSubmitting(model.components.sendXlm.FORM)

export const getData = state => {
  const paymentR = selectors.components.sendXlm.getPayment(state)

  const transform = payment => {
    const fromLabel = xlmFromLabel(payment, state)
    const toLabel = payment.to.label || payment.to.address

    return {
      submitting: isSubmitting(state),
      description: payment.description,
      memo: payment.memo,
      memoType: payment.memoType,
      fromAddress: fromLabel,
      toAddress: toLabel,
      amount: payment.amount,
      fee: payment.fee,
      total: utils.xlm.calculateTransactionAmount(payment.amount, payment.fee)
    }
  }

  return paymentR.map(transform)
}
