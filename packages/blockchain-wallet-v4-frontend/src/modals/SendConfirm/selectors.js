import { formValueSelector } from 'redux-form'
import { filter, head, isNil, prop, lift } from 'ramda'
import { selectors } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'

export const getData = (state, props) => {
  // const to = formValueSelector('sendConfirm')(state, 'to')
  // const to2 = formValueSelector('sendConfirm')(state, 'to2')
  // const from = formValueSelector('sendConfirm')(state, 'from')
  // const message = formValueSelector('sendConfirm')(state, 'message')
  // const to = props.data.data.to || 'test to'
  // const to = props ? props.data.data.to : 'test to'
  // const from = props.data.data.from.label || 'test from'
  // const message = props.data.data.
  const f = selectors.core.wallet.getAccountLabel(state)
  const g = selectors.core.wallet.getLegacyAddressLabel(state)
  const currency = selectors.core.settings.getCurrency(state)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)
  const settings = selectors.core.settings.getSettings(state)
  // const toAddress = !isNil(to2) ? to2 : (to.address || g(to.address) || f(to.index))
  // const fromAddress = from.address || g(from.address) || f(from.index)
  // const amount = props.data.data.amount || 'test amount'
  // const satoshis = prop('value', head(filter(x => !x.change, prop('outputs', selection))))
  const selection = selectors.core.data.bitcoin.getSelection(state)
  const fee = prop('fee', selection)
  const satoshis = prop('value', head(filter(x => !x.change, prop('outputs', selection))))
  const transform = (btcRates, ethRates, settings) => {
    const fiatSendAmount = Exchange.convertBitcoinToFiat({ value: satoshis, fromUnit: 'SAT', toCurrency: settings.currency, rates: btcRates })
    const fiatFeeAmount = Exchange.convertBitcoinToFiat({ value: fee, fromUnit: 'SAT', toCurrency: settings.currency, rates: btcRates })
    const fiatTotal = Number(fiatSendAmount.value) + Number(fiatFeeAmount.value)
    return ({ btcRates, ethRates, settings, selection, fee, satoshis, fiatTotal, currency })
  }

  return lift(transform)(bitcoinRates, ethereumRates, settings)
}
