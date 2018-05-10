import { selectors } from 'data'
import { curry, filter, head, length, lift, prop, propEq } from 'ramda'
import { formValueSelector } from 'redux-form'

export const format = acc => ({ text: prop('label', acc), value: acc })

export const formatDefault = curry((coin, acc) => ({ text: coin, value: acc }))

export const generateGroup = (bchAccounts, btcAccounts, ethAccounts, hasOneAccount) => {
  if (hasOneAccount) {
    const accounts = [
      btcAccounts.map(formatDefault('Bitcoin')),
      bchAccounts.map(formatDefault('Bitcoin cash')),
      ethAccounts.map(formatDefault('Ether'))
    ]

    return [{
      group: '',
      items: accounts.reduce((a, b) => a.concat(b))
    }]
  }
  return [
    { group: 'Bitcoin', items: btcAccounts.map(format) },
    { group: 'Bitcoin cash', items: bchAccounts.map(format) },
    { group: 'Ether', items: ethAccounts.map(format) }
  ]
}

export const getData = state => {
  const btcAccountsR = getBtcAccounts(state)
  const bchAccountsR = getBchAccounts(state)
  const ethAccountsR = getEthAccounts(state)
  const currencyR = selectors.core.settings.getCurrency(state)
  const enabled = selectors.components.exchange.getFirstStepEnabled(state)
  const formError = selectors.components.exchange.getError(state)
  const source = formValueSelector('exchange')(state, 'source')
  const target = formValueSelector('exchange')(state, 'target')
  const sourceCoin = prop('coin', source) || 'BTC'
  const targetCoin = prop('coin', target) || 'ETH'

  const transform = (btcAccounts, bchAccounts, ethAccounts, currency) => {
    const isActive = propEq('archived', false)
    const activeBtcAccounts = filter(isActive, btcAccounts)
    const activeBchAccounts = filter(isActive, bchAccounts)
    const activeEthAccounts = filter(isActive, ethAccounts)
    const defaultBtcAccount = head(activeBtcAccounts)
    const defaultEthAccount = head(activeEthAccounts)
    const hasOneAccount = length(activeBtcAccounts) === 1
    const elements = generateGroup(activeBchAccounts, activeBtcAccounts, activeEthAccounts, hasOneAccount)
    const initialValues = { source: defaultBtcAccount, target: defaultEthAccount }

    return {
      elements,
      initialValues,
      hasOneAccount,
      enabled,
      formError,
      currency,
      sourceCoin,
      targetCoin
    }
  }

  return lift(transform)(btcAccountsR, bchAccountsR, ethAccountsR, currencyR)
}

const getBchAccounts = state => {
  const bchAccounts = selectors.core.wallet.getHDAccounts(state)
  const bchDataR = selectors.core.data.bch.getAddresses(state)
  const bchMetadataR = selectors.core.kvStore.bch.getAccounts(state)

  const transform = (bchData, bchMetadata) => bchAccounts.map(acc => {
    const index = prop('index', acc)
    const data = prop(prop('xpub', acc), bchData)
    const metadata = bchMetadata[index]

    return {
      archived: prop('archived', metadata),
      coin: 'BCH',
      label: prop('label', metadata) || prop('xpub', acc),
      address: index,
      balance: prop('final_balance', data)
    }
  })

  return lift(transform)(bchDataR, bchMetadataR)
}

const getBtcAccounts = state => {
  const btcAccounts = selectors.core.wallet.getHDAccounts(state)
  const btcData = selectors.core.data.bitcoin.getAddresses(state)

  const transform = (btcData) => {
    return btcAccounts.map(acc => ({
      archived: prop('archived', acc),
      coin: 'BTC',
      label: prop('label', acc) || prop('xpub', acc),
      address: prop('index', acc),
      balance: prop('final_balance', prop(prop('xpub', acc), btcData))
    }))
  }

  return lift(transform)(btcData)
}

const getEthAccounts = state => {
  const ethData = selectors.core.data.ethereum.getAddresses(state)
  const ethMetadata = selectors.core.kvStore.ethereum.getAccounts(state)

  const transform = (ethData, ethMetadata) => ethMetadata.map(acc => {
    const data = prop(prop('addr', acc), ethData)

    return {
      archived: prop('archived', acc),
      coin: 'ETH',
      label: prop('label', acc) || prop('addr', acc),
      address: prop('addr', acc),
      balance: prop('balance', data)
    }
  })

  return lift(transform)(ethData, ethMetadata)
}
