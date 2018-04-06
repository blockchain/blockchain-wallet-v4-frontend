import { formValueSelector } from 'redux-form'
import { equals, filter, head, lift, map, prop, is, has } from 'ramda'
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
  // TODO: Use BCH instead of BITCOIN network
  const getReceive = index => selectors.core.common.bch.getNextAvailableReceiveAddress(settings.NETWORK_BCH, index, state)
  const getChange = index => selectors.core.common.bch.getNextAvailableChangeAddress(settings.NETWORK_BCH, index, state)

  const toDropdown = map(x => ({ text: x.label, value: x }))
  const balancesR = selectors.core.common.bch.getAccountsBalances(state).map(toDropdown)
  const xpub = selectors.core.wallet.getDefaultAccountXpub(state)
  const defaultFromR = balancesR.map(x => prop('value', head(filter(y => equals(y.value.xpub, xpub), x))))
  const feeR = selectors.core.data.bch.getFee(state)
  const coinsR = selectors.core.data.bch.getCoins(state)
  const coin = formValueSelector('sendBch')(state, 'coin')
  const from = formValueSelector('sendBch')(state, 'from')
  const to = formValueSelector('sendBch')(state, 'to') || formValueSelector('sendBch')(state, 'to2')
  const amount = formValueSelector('sendBch')(state, 'amount')
  const effectiveBalance = selectors.core.data.bch.getEffectiveBalance(state)
  const receiveAddressR = extractAddress(getReceive, to)
  const changeAddressR = extractAddress(getChange, from)

  const transform = (defaultFrom, fee, coins, receiveAddress, changeAddress) => ({
    initialValues: {
      from: defaultFrom,
      coin: 'BCH'
    },
    coin,
    from,
    fee,
    to,
    amount,
    effectiveBalance,
    effectiveBalanceScaled: Exchange.convertBchToBch({ value: effectiveBalance, fromUnit: 'SAT', toUnit: 'BCH' }).value,
    coins,
    receiveAddress,
    changeAddress,
    unit: 'BCH'
  })

  return lift(transform)(defaultFromR, feeR, coinsR, receiveAddressR, changeAddressR)
}
