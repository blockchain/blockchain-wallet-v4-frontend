import { length, prop, path } from 'ramda'
import { model, selectors } from 'data'
import { formValueSelector } from 'redux-form'
import Bitcoin from 'bitcoinjs-lib'

export const getData = state => {
  const toToggled = selectors.components.sendBsv.getToToggled(state)
  const paymentR = selectors.components.sendBsv.getPayment(state)
  const networkType = selectors.core.walletOptions
    .getBtcNetwork(state)
    .getOrElse('bitcoin')
  const network = Bitcoin.networks[networkType]
  const bsvAccountsLength = length(
    selectors.core.kvStore.bsv.getAccounts(state).getOrElse([])
  )

  const enableToggle = bsvAccountsLength > 1

  const transform = payment => {
    const minFeePerByte = path(['fees', 'limit', 'min'], payment)
    const maxFeePerByte = path(['fees', 'limit', 'max'], payment)
    const totalFee = path(['selection', 'fee'], payment)
    const effectiveBalance = prop('effectiveBalance', payment)
    const destination = formValueSelector(model.components.sendBsv.FORM)(
      state,
      'to'
    )
    const from = formValueSelector(model.components.sendBsv.FORM)(state, 'from')

    return {
      from,
      network,
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
