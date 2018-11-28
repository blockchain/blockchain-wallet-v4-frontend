import { length, prop, path, isEmpty } from 'ramda'
import { model, selectors } from 'data'
import { formValueSelector } from 'redux-form'
import Bitcoin from 'bitcoinjs-lib'

export const getData = state => {
  const toToggled = selectors.components.sendBch.getToToggled(state)
  const paymentR = selectors.components.sendBch.getPayment(state)
  const lockboxEnabled = !isEmpty(
    selectors.core.kvStore.lockbox.getDevices(state).getOrElse([])
  )
  const availability = selectors.core.walletOptions.getCoinAvailability(
    state,
    'BCH'
  )
  const excludeLockbox = !availability.map(prop('lockbox')).getOrElse(true)
  const networkType = selectors.core.walletOptions
    .getBtcNetwork(state)
    .getOrElse('bitcoin')
  const network = Bitcoin.networks[networkType]
  const bchAccountsLength = length(
    selectors.core.kvStore.bch.getAccounts(state).getOrElse([])
  )

  const enableToggle = bchAccountsLength > 1 || lockboxEnabled

  const transform = payment => {
    const minFeePerByte = path(['fees', 'limit', 'min'], payment)
    const maxFeePerByte = path(['fees', 'limit', 'max'], payment)
    const totalFee = path(['selection', 'fee'], payment)
    const effectiveBalance = prop('effectiveBalance', payment)
    const destination = formValueSelector(model.components.sendBch.FORM)(
      state,
      'to'
    )
    const from = formValueSelector(model.components.sendBch.FORM)(state, 'from')

    return {
      from,
      network,
      toToggled,
      enableToggle,
      effectiveBalance,
      minFeePerByte,
      maxFeePerByte,
      destination,
      totalFee,
      excludeLockbox
    }
  }

  return paymentR.map(transform)
}
