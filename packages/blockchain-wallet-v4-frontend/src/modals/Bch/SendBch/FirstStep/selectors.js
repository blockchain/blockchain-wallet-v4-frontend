import * as Bitcoin from 'bitcoinjs-lib'
import { path, prop } from 'ramda'
import { formValueSelector } from 'redux-form'

import { model, selectors } from 'data'

export const getData = (state) => {
  const amount = formValueSelector(model.components.sendBch.FORM)(state, 'amount')
  const destination = formValueSelector(model.components.sendBch.FORM)(state, 'to')
  const from = formValueSelector(model.components.sendBch.FORM)(state, 'from')

  const paymentR = selectors.components.sendBch.getPayment(state)
  const sendLimits = selectors.components.sendBch.getSendLimits(state).getOrElse({})
  const networkType = 'bitcoin'
  const isMnemonicVerified = selectors.core.wallet.isMnemonicVerified(state)
  const network = Bitcoin.networks[networkType]
  const importedAddressSweepFeatureFlag = selectors.core.walletOptions
    .getImportedAddressSweep(state)
    .getOrElse(false)
  const importedAddressSweepGetInfo = selectors.core.settings.getImportSweep(state).getOrElse(false)

  const transform = (payment) => {
    const minFeePerByte = path(['fees', 'limit', 'min'], payment)
    const maxFeePerByte = path(['fees', 'limit', 'max'], payment)
    const totalFee = path(['selection', 'fee'], payment)
    const effectiveBalance = prop('effectiveBalance', payment)

    return {
      amount,
      destination,
      effectiveBalance,
      from,
      importedAddressSweepFeatureFlag,
      importedAddressSweepGetInfo,
      isMnemonicVerified,
      maxFeePerByte,
      minFeePerByte,
      network,
      sendLimits,
      totalFee
    }
  }

  return paymentR.map(transform)
}

export default getData
