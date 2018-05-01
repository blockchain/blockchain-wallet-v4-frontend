import { prop, path } from 'ramda'
import { selectors } from 'data'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const toToggled = selectors.components.sendBch.getToToggled(state)
  const paymentR = selectors.components.sendBch.getPayment(state)

  const transform = payment => {
    const minFeePerByte = path(['fees', 'limit', 'min'], payment)
    const maxFeePerByte = path(['fees', 'limit', 'max'], payment)
    const totalFee = path(['selection', 'fee'], payment)
    const effectiveBalance = prop('effectiveBalance', payment)
    const destination = formValueSelector('sendBch')(state, 'to')

    return {
      toToggled,
      effectiveBalance,
      minFeePerByte,
      maxFeePerByte,
      destination,
      totalFee
    }
  }

  return paymentR.map(transform)
}
