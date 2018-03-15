import { has, is, concat, head, prop } from 'ramda'
import { selectors } from 'data'
import { formValueSelector } from 'redux-form'
import { getPairFromCoin } from 'services/ShapeshiftService'
import settings from 'config'

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (selector, value) => {
  if (value == null) return undefined
  if (is(String, value)) return value
  if (has('address', value)) return prop('address', value)
  if (has('index', value)) return selector(prop('index', value)).getOrElse(undefined)
  return undefined
}

export const getData = state => {
  const getReceive = index => selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, index, state)
  const getChange = index => selectors.core.common.bitcoin.getNextAvailableChangeAddress(settings.NETWORK_BITCOIN, index, state)

  const btcHDAccountsInfo = selectors.core.common.bitcoin.getAccountsInfo(state)
  const btcAddressesInfo = selectors.core.common.bitcoin.getAddressesInfo(state)
  const btcAccountsInfo = concat(btcHDAccountsInfo, btcAddressesInfo)
  const ethAccountsInfo = selectors.core.common.ethereum.getAccountsInfo(state).getOrElse([])
  const defaultBtcAccount = head(btcAccountsInfo)
  const defaultEthAccount = head(ethAccountsInfo)
  const currency = selectors.core.settings.getCurrency(state).getOrElse('USD')
  const accounts = formValueSelector('exchange')(state, 'accounts')
  const amount = formValueSelector('exchange')(state, 'amount')
  const source = prop('source', accounts)
  const sourceReceiveAddress = extractAddress(getReceive, source)
  const sourceChangeAddress = extractAddress(getChange, source)
  const sourceAmount = prop('source', amount)
  const sourceCoin = prop('coin', source)
  const target = prop('target', accounts)
  const targetReceiveAddress = extractAddress(getReceive, target)
  const targetChangeAddress = extractAddress(getChange, target)
  const targetAmount = prop('target', amount)
  const targetCoin = prop('coin', target)
  const pair = getPairFromCoin(sourceCoin, targetCoin)

  return {
    defaultAccounts: {
      BTC: defaultBtcAccount,
      ETH: defaultEthAccount
    },
    initialValues: {
      accounts: { source: defaultBtcAccount, target: defaultEthAccount },
      amount: { source: '', target: '' },
      balance: { balance: 0, fee: 0 }
    },
    elements: [
      { group: 'Bitcoin', items: btcAccountsInfo.map(x => ({ text: x.label, value: x })) },
      { group: 'Ethereum', items: ethAccountsInfo.map(x => ({ text: x.label, value: x })) }
    ],
    currency,
    source,
    sourceCoin,
    sourceReceiveAddress,
    sourceChangeAddress,
    sourceAmount,
    target,
    targetCoin,
    targetReceiveAddress,
    targetChangeAddress,
    targetAmount,
    pair
  }
}
