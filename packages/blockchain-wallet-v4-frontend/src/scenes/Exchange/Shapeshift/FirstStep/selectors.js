import { selectors } from 'data'
import { curry, filter, head, length, lift, prop, propEq } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const format = acc => ({ text: prop('label', acc), value: acc })

export const formatDefault = curry((coin, acc) => ({ text: coin, value: acc }))

export const generateGroup = (
  bchAccounts,
  btcAccounts,
  ethAccounts,
  hasOneAccount
) => {
  if (hasOneAccount) {
    const accounts = [
      btcAccounts.map(formatDefault('Bitcoin')),
      bchAccounts.map(formatDefault('Bitcoin Cash')),
      ethAccounts.map(formatDefault('Ether'))
    ]

    return [
      {
        group: '',
        items: accounts.reduce((a, b) => a.concat(b))
      }
    ]
  }
  return [
    { group: 'Bitcoin', items: btcAccounts.map(format) },
    { group: 'Bitcoin Cash', items: bchAccounts.map(format) },
    { group: 'Ether', items: ethAccounts.map(format) }
  ]
}

const getBchAccounts = createDeepEqualSelector(
  [
    selectors.core.wallet.getHDAccounts,
    selectors.core.data.bch.getAddresses,
    selectors.core.kvStore.bch.getAccounts
  ],
  (bchAccounts, bchDataR, bchMetadataR) => {
    const transform = (bchData, bchMetadata) =>
      bchAccounts.map(acc => {
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
)

const getBtcAccounts = createDeepEqualSelector(
  [
    selectors.core.wallet.getHDAccounts,
    selectors.core.data.bitcoin.getAddresses
  ],
  (btcAccounts, btcDataR) => {
    const transform = btcData => {
      return btcAccounts.map(acc => ({
        archived: prop('archived', acc),
        coin: 'BTC',
        label: prop('label', acc) || prop('xpub', acc),
        address: prop('index', acc),
        balance: prop('final_balance', prop(prop('xpub', acc), btcData))
      }))
    }

    return lift(transform)(btcDataR)
  }
)

const getEthAccounts = createDeepEqualSelector(
  [
    selectors.core.data.ethereum.getAddresses,
    selectors.core.kvStore.ethereum.getAccounts
  ],
  (ethDataR, ethMetadataR) => {
    const transform = (ethData, ethMetadata) =>
      ethMetadata.map(acc => {
        const data = prop(prop('addr', acc), ethData)

        return {
          archived: prop('archived', acc),
          coin: 'ETH',
          label: prop('label', acc) || prop('addr', acc),
          address: prop('addr', acc),
          balance: prop('balance', data)
        }
      })

    return lift(transform)(ethDataR, ethMetadataR)
  }
)

export const getData = createDeepEqualSelector(
  [
    getBtcAccounts,
    getBchAccounts,
    getEthAccounts,
    selectors.core.settings.getCurrency,
    selectors.components.exchange.getFirstStepEnabled,
    selectors.components.exchange.getError,
    selectors.form.getFormValues('exchange')
  ],
  (
    btcAccountsR,
    bchAccountsR,
    ethAccountsR,
    currencyR,
    enabled,
    formError,
    formValues
  ) => {
    const source = prop('source', formValues)
    const target = prop('target', formValues)
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
      const elements = generateGroup(
        activeBchAccounts,
        activeBtcAccounts,
        activeEthAccounts,
        hasOneAccount
      )
      const initialValues = {
        source: defaultBtcAccount,
        target: defaultEthAccount
      }

      return {
        elements,
        initialValues,
        hasOneAccount,
        disabled: !enabled,
        formError,
        currency,
        sourceCoin,
        targetCoin
      }
    }
    return lift(transform)(btcAccountsR, bchAccountsR, ethAccountsR, currencyR)
  }
)
