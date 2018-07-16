import { length, prop, path } from 'ramda'
import { selectors } from 'data'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const toToggled = selectors.components.sendBch.getToToggled(state)
  const paymentR = selectors.components.sendBch.getPayment(state)
  const bchAccountsLength = length(selectors.core.kvStore.bch.getAccounts(state).getOrElse([]))
  const enableToggle = bchAccountsLength > 1

  const transform = payment => {
    const minFeePerByte = path(['fees', 'limit', 'min'], payment)
    const maxFeePerByte = path(['fees', 'limit', 'max'], payment)
    const totalFee = path(['selection', 'fee'], payment)
    const effectiveBalance = prop('effectiveBalance', payment)
    const destination = formValueSelector('sendBch')(state, 'to')
    const from = formValueSelector('sendBch')(state, 'from')

    return {
      from,
      toToggled,
      enableToggle,
      effectiveBalance,
      minFeePerByte,
      maxFeePerByte,
      destination,
      totalFee
    }
  }

  return paymentR.map(transform)
}
