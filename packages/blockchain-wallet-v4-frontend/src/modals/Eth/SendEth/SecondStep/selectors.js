import { equals } from 'ramda'

import { selectors, model } from 'data'
import { ethFromLabel, erc20FromLabel } from 'services/PaymentHelper'
import { utils } from 'blockchain-wallet-v4/src'

const isSubmitting = selectors.form.isSubmitting(model.components.sendEth.FORM)

export const getData = (state, coin) => {
  const paymentR = selectors.components.sendEth.getPayment(state)

  const transform = payment => {
    const fromLabel = equals(coin, 'ETH')
      ? ethFromLabel(payment, state)
      : erc20FromLabel(coin, payment, state)
    return {
      submitting: isSubmitting(state),
      description: payment.description,
      fromAddress: fromLabel,
      toAddress: payment.to.label || payment.to.address,
      amount: payment.amount,
      fee: payment.fee,
      total: utils.eth.calculateTransactionAmount(payment.amount, payment.fee)
    }
  }

  return paymentR.map(transform)
}
