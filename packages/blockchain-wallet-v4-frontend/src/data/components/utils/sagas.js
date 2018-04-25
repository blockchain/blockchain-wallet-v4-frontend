import { call, select } from 'redux-saga/effects'
import { equals, filter, identity, is, isEmpty, prop, propEq } from 'ramda'
import { selectors } from 'data'
import settings from 'config'

export const selectRates = function * (coin) {
  const bchRatesR = yield select(selectors.core.data.bch.getRates)
  const btcRatesR = yield select(selectors.core.data.bitcoin.getRates)
  const ethRatesR = yield select(selectors.core.data.ethereum.getRates)
  switch (coin) {
    case 'BCH': return bchRatesR.getOrFail('Could not find bitcoin cash rates.')
    case 'BTC': return btcRatesR.getOrFail('Could not find bitcoin rates.')
    case 'ETH': return ethRatesR.getOrFail('Could not find ethereum rates.')
  }
}

export const selectReceiveAddress = function * (source) {
  const appState = yield select(identity)
  const coin = prop('coin', source)
  const address = prop('address', source)
  if (equals('ETH', coin) && is(String, address)) return address
  if (equals('BCH', coin) && is(Number, address)) {
    const bchReceiveAddress = selectors.core.common.bch.getNextAvailableReceiveAddress(settings.NETWORK_BCH, address, appState)
    if (isEmpty(bchReceiveAddress.getOrElse(''))) throw new Error('Could not generate bitcoin cash receive address')
    return bchReceiveAddress.getOrElse('')
  }
  if (equals('BTC', coin) && is(Number, address)) {
    const btcReceiveAddress = selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, address, appState)
    if (isEmpty(btcReceiveAddress.getOrElse(''))) throw new Error('Could not generate return bitcoin receive address')
    return btcReceiveAddress.getOrElse('')
  }
  throw new Error('Could not generate receive address')
}

export const getBchAccounts = function * () {
  const appState = yield select(identity)
  const bchAccounts = selectors.core.wallet.getHDAccounts(appState)
  const bchData = selectors.core.data.bch.getAddresses(appState).getOrFail('Can not retrieve bitcoin cash data.')
  const bchMetadata = selectors.core.kvStore.bch.getAccounts(appState).getOrFail('Can not retrieve bitcoin cash metadata.')

  const transform = acc => {
    const index = prop('index', acc)
    const data = prop(prop('xpub', acc), bchData)
    const metadata = bchMetadata[index]
    return {
      archived: prop('archived', metadata),
      coin: 'BCH',
      text: prop('label', metadata) || prop('xpub', acc),
      address: index,
      balance: prop('final_balance', data)
    }
  }

  return bchAccounts.map(transform)
}

export const getActiveBchAccounts = function * () {
  const bchAccounts = yield call(getBchAccounts)
  return filter(propEq('archived', false), bchAccounts)
}

export const getBtcAccounts = function * () {
  const appState = yield select(identity)
  const btcAccounts = selectors.core.wallet.getHDAccounts(appState)
  const btcData = selectors.core.data.bitcoin.getAddresses(appState).getOrFail('Can not retrieve bitcoin data.')

  const transform = acc => ({
    archived: prop('archived', acc),
    coin: 'BTC',
    text: prop('label', acc) || prop('xpub', acc),
    address: prop('index', acc),
    balance: prop('final_balance', prop(prop('xpub', acc), btcData))
  })

  return btcAccounts.map(transform)
}

export const getActiveBtcAccounts = function * () {
  const btcAccounts = yield call(getBtcAccounts)
  return filter(propEq('archived', false), btcAccounts)
}

export const getEthAccounts = function * () {
  const appState = yield select(identity)
  const ethData = selectors.core.data.ethereum.getAddresses(appState).getOrFail('Can not retrieve ethereum data.')
  const ethMetadata = selectors.core.kvStore.ethereum.getAccounts(appState).getOrFail('Can not retrieve ethereum metadata.')

  const transform = acc => {
    const data = prop(prop('addr', acc), ethData)
    return {
      archived: prop('archived', acc),
      coin: 'ETH',
      text: prop('label', acc) || prop('addr', acc),
      address: prop('addr', acc),
      balance: prop('balance', data)
    }
  }

  return ethMetadata.map(transform)
}

export const getActiveEthAccounts = function * () {
  const ethAccounts = yield call(getEthAccounts)
  return filter(propEq('archived', false), ethAccounts)
}
