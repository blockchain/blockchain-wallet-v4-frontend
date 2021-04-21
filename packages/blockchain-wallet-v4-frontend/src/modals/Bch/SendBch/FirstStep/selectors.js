import * as Bitcoin from 'bitcoinjs-lib'
import { path, prop } from 'ramda'
import { formValueSelector } from 'redux-form'

import { model, selectors } from 'data'

export const getData = state => {
  const amount = formValueSelector(model.components.sendBch.FORM)(
    state,
    'amount'
  )
  const destination = formValueSelector(model.components.sendBch.FORM)(
    state,
    'to'
  )
  const from = formValueSelector(model.components.sendBch.FORM)(state, 'from')

  const paymentR = selectors.components.sendBch.getPayment(state)
  const availability = selectors.core.walletOptions.getCoinAvailability(
    state,
    'BCH'
  )
  const excludeLockbox = !availability.map(prop('lockbox')).getOrElse(true)
  const networkType = selectors.core.walletOptions
    .getBtcNetwork(state)
    .getOrElse('bitcoin')
  const isMnemonicVerified = selectors.core.wallet.isMnemonicVerified(state)
  const network = Bitcoin.networks[networkType]

  const transform = payment => {
    const minFeePerByte = path(['fees', 'limit', 'min'], payment)
    const maxFeePerByte = path(['fees', 'limit', 'max'], payment)
    const totalFee = path(['selection', 'fee'], payment)
    const effectiveBalance = prop('effectiveBalance', payment)

    return {
      amount,
      destination,
      effectiveBalance,
      excludeLockbox,
      from,
      isMnemonicVerified,
      maxFeePerByte,
      minFeePerByte,
      network,
      totalFee
    }
  }

  return paymentR.map(transform)
}
