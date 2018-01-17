import { formValueSelector } from 'redux-form'
import { equals, filter, head, lift, map, prop, path } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import settings from 'config'
import { selectors } from 'data'

// export const getData = state => {
//   // coin: formValueSelector('sendBitcoin')(state, 'coin'),
//   // from: formValueSelector('sendBitcoin')(state, 'from'),
//   // to: formValueSelector('sendBitcoin')(state, 'to'),
//   // to2: formValueSelector('sendBitcoin')(state, 'to2'),
//   // amount: formValueSelector('sendBitcoin')(state, 'amount'),
//   // message: formValueSelector('sendBitcoin')(state, 'message'),
//   // fee: formValueSelector('sendBitcoin')(state, 'fee'),
//   // selection: selectors.core.data.bitcoin.getSelection(state),
//   // feeValues: selectors.core.data.bitcoin.getFee(state),
//   // effectiveBalance: selectors.core.data.bitcoin.getEffectiveBalance(state),
//   // coins: selectors.core.data.bitcoin.getCoins(state),
//   // unit: selectors.core.settings.getBtcUnit(state)

//   const fee = selectors.core.data.bitcoin.getFee(state)
//   return fee
// }

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (selectorFunction, value) =>
  value
    ? value.address
      ? Remote.of(value.address)
      : selectorFunction(value.index)
    : Remote.of(undefined)

export const getData = state => {
  const toDropdown = map(x => ({ text: x.label, value: x }))
  const balancesR = selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown)
  const xpub = selectors.core.wallet.getDefaultAccountXpub(state)
  const fromR = balancesR.map(x => prop('value', head(filter(y => equals(y.value.xpub, xpub), x))))
  const feeR = selectors.core.data.bitcoin.getFee(state)
  const feeRegularR = feeR.map(path(['regular']))

  const coin = formValueSelector('sendBitcoin')(state, 'coin')
  const from = formValueSelector('sendBitcoin')(state, 'from')
  const to = formValueSelector('sendBitcoin')(state, 'to')
  const to2 = formValueSelector('sendBitcoin')(state, 'to2')
  const toFinal = to || to2

  const transform = (fromR, feeR) => ({
    initialValues: {
      from: fromR,
      fee: feeR,
      coin: 'BTC'
    },
    coin,
    from,
    to: toFinal
  })

  return lift(transform)(fromR, feeRegularR)

  // const getReceive = index => selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  // const getChange = index => selectors.core.common.bitcoin.getNextAvailableChangeAddress(settings.NETWORK, index, state)
  // const coin = formValueSelector('sendBitcoin')(state, 'coin')
  // const from = formValueSelector('sendBitcoin')(state, 'from')
  // const to = formValueSelector('sendBitcoin')(state, 'to')
  // const to2 = formValueSelector('sendBitcoin')(state, 'to2')
  // const toFinal = to || to2

  // const amount = formValueSelector('sendBitcoin')(state, 'amount')
  // const message = formValueSelector('sendBitcoin')(state, 'message')
  // const fee = formValueSelector('sendBitcoin')(state, 'fee')
  // const selection = selectors.core.data.bitcoin.getSelection(state)
  // const feeValues = selectors.core.data.bitcoin.getFee(state)
  // const effectiveBalance = selectors.core.data.bitcoin.getEffectiveBalance(state)
  // const coins = selectors.core.data.bitcoin.getCoins(state)
  // const unit = selectors.core.settings.getBtcUnit(state)

  // const receiveAddressR = extractAddress(getReceive, toFinal)
  // const changeAddressR = extractAddress(getChange, from)
  // const addressesR = lift((receiveAddress, changeAddress, fee) =>
  //   ({ receiveAddress, changeAddress, fee }))(receiveAddressR, changeAddressR, feeR)

  // return addressesR
}

export const getFormValues = state => {
  const coin = formValueSelector('sendBitcoin')(state, 'coin')
  const from = formValueSelector('sendBitcoin')(state, 'from')
  const to = formValueSelector('sendBitcoin')(state, 'to')
  const to2 = formValueSelector('sendBitcoin')(state, 'to2')
  const toFinal = to || to2

  return {
    coin,
    from,
    to: toFinal
  }
}

export const getInitialValues = state => {
  // const toDropdown = map(x => ({ text: x.label, value: x }))
  // const balancesR = selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown)
  // const xpub = selectors.core.wallet.getDefaultAccountXpub(state)
  // const fromR = balancesR.map(x => prop('value', head(filter(y => equals(y.value.xpub, xpub), x))))
  // const feeR = selectors.core.data.bitcoin.getFee(state)
  // const feeRegularR = feeR.map(path(['regular']))
  // return lift((from, fee) => ({ from, fee, coin: 'BTC' }))(fromR, feeRegularR)
}
