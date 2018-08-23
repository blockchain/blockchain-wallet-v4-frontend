import { length, prop, path, isEmpty } from 'ramda'
import { selectors } from 'data'
import { formValueSelector } from 'redux-form'
import Bitcoin from 'bitcoinjs-lib'

export const getData = state => {
  const toToggled = selectors.components.sendBch.getToToggled(state)
  const paymentR = selectors.components.sendBch.getPayment(state)
  const lockboxEnabled = !isEmpty(
    selectors.core.kvStore.lockbox.getDevices(state).getOrElse({})
  )
  const networkTypeR = selectors.core.walletOptions.getBtcNetwork(state)
  const networkType = networkTypeR.getOrElse('bitcoin')
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
    const destination = formValueSelector('sendBch')(state, 'to')
    const from = formValueSelector('sendBch')(state, 'from')

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
