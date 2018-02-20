import { formValueSelector } from 'redux-form'
import { filter, head, isNil, prop } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const to = formValueSelector('sendBtc')(state, 'to')
  const to2 = formValueSelector('sendBtc')(state, 'to2')
  const from = formValueSelector('sendBtc')(state, 'from')
  const message = formValueSelector('sendBtc')(state, 'message')
  const f = selectors.core.wallet.getAccountLabel(state)
  const g = selectors.core.wallet.getLegacyAddressLabel(state)
  const toAddress = !isNil(to2) ? to2 : (to.address || g(to.address) || f(to.index))
  const fromAddress = from.address || g(from.address) || f(from.index)
  const selection = selectors.core.data.bitcoin.getSelection(state)
  const fee = prop('fee', selection)
  const satoshis = prop('value', head(filter(x => !x.change, prop('outputs', selection))))
  const total = satoshis + fee

  return {
    fee,
    message,
    fromAddress,
    toAddress,
    satoshis,
    selection,
    total
  }
}
