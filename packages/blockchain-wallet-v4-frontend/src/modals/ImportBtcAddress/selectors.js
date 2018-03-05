import { formValueSelector } from 'redux-form'
import { lift, prop, path, is, has } from 'ramda'
import settings from 'config'
import { Remote } from 'blockchain-wallet-v4/src'
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

  const feeR = selectors.core.data.bitcoin.getFee(state)
  const defaultFeeR = feeR.map(path(['regular']))
  const coinsR = selectors.core.data.bitcoin.getCoins(state)
  const from = {
    address: {
      address: formValueSelector('importBtcAddress')(state, 'from'),
      priv: formValueSelector('importBtcAddress')(state, 'priv')
    }
  }
  const to = formValueSelector('importBtcAddress')(state, 'to')
  const receiveAddressR = extractAddress(getReceive, to)
  const changeAddressR = extractAddress(getChange, from)
  const unitR = selectors.core.settings.getBtcUnit(state)

  const transform = (defaultFee, coins, receiveAddress, changeAddress, unit) => ({
    from,
    to,
    coins,
    receiveAddress,
    changeAddress,
    unit
  })

  return lift(transform)(defaultFeeR, coinsR, receiveAddressR, changeAddressR, unitR)
}
