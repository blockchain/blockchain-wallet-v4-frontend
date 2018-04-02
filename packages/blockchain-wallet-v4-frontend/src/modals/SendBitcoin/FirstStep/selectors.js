import { formValueSelector } from 'redux-form'
import { equals, filter, head, lift, map, prop, path, is, has } from 'ramda'
import settings from 'config'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (selector, value) => {
  if (value == null) return Remote.of(undefined)
  if (is(String, value)) return Remote.of(value)
  if (has('address', value)) return Remote.of(prop('address', value))
  if (has('index', value)) return selector(prop('index', value))
  return Remote.of(undefined)
}

export const getData = state => {
  const getReceive = index => selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, index, state)
  const getChange = index => selectors.core.common.bitcoin.getNextAvailableChangeAddress(settings.NETWORK_BITCOIN, index, state)

  const toDropdown = map(x => ({ text: x.label, value: x }))
  const balancesR = selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown)
  const xpub = selectors.core.wallet.getDefaultAccountXpub(state)
  const defaultFromR = balancesR.map(x => prop('value', head(filter(y => equals(y.value.xpub, xpub), x))))
  const feeR = selectors.core.data.bitcoin.getFee(state)
  const fees = {
    limits: feeR.map(path(['limits'])),
    regular: feeR.map(path(['regular'])),
    priority: feeR.map(path(['priority']))
  }
  const defaultFeeR = feeR.map(path(['regular']))
  const coinsR = selectors.core.data.bitcoin.getCoins(state)
  const coin = formValueSelector('sendBitcoin')(state, 'coin')
  const from = formValueSelector('sendBitcoin')(state, 'from')
  const to = formValueSelector('sendBitcoin')(state, 'to') || formValueSelector('sendBitcoin')(state, 'to2')
  const fee = formValueSelector('sendBitcoin')(state, 'fee')
  const amount = formValueSelector('sendBitcoin')(state, 'amount')
  const effectiveBalance = selectors.core.data.bitcoin.getEffectiveBalance(state)
  const receiveAddressR = extractAddress(getReceive, to)
  const changeAddressR = extractAddress(getChange, from)
  const unitR = selectors.core.settings.getBtcUnit(state)
  const selection = selectors.core.data.bitcoin.getSelection(state)

  const transform = (defaultFrom, defaultFee, coins, receiveAddress, changeAddress, unit) => ({
    initialValues: {
      from: defaultFrom,
      fee: defaultFee,
      coin: 'BTC'
    },
    coin,
    from,
    fee,
    fees,
    to,
    amount,
    effectiveBalance,
    effectiveBalanceScaled: Exchange.convertBitcoinToBitcoin({ value: effectiveBalance, fromUnit: 'SAT', toUnit: unit }).value,
    coins,
    receiveAddress,
    changeAddress,
    unit,
    selection
  })

  return lift(transform)(defaultFromR, defaultFeeR, coinsR, receiveAddressR, changeAddressR, unitR)
}
