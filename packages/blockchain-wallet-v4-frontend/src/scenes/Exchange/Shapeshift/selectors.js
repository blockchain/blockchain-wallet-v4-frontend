import { concat, head, prop } from 'ramda'
import { selectors } from 'data'
import { formValueSelector } from 'redux-form'
import { getPairFromCoin } from './services'

export const getData = state => {
  const btcFee = selectors.core.data.bitcoin.getFee(state).getOrElse({ regular: 10, priority: 20 })
  const ethFee = selectors.core.data.ethereum.getFee(state).getOrElse({ regular: 10, priority: 20, gasLimit: 21000 })
  const btcHDAccountsInfo = selectors.core.common.bitcoin.getAccountsInfo(state)
  const btcAddressesInfo = selectors.core.common.bitcoin.getAddressesInfo(state)
  const btcAccountsInfo = concat(btcHDAccountsInfo, btcAddressesInfo)
  const ethAccountsInfo = selectors.core.common.ethereum.getAccountsInfo(state).getOrElse([])
  const defaultBtcAccount = head(btcAccountsInfo)
  const defaultEthAccount = head(ethAccountsInfo)
  const currency = selectors.core.settings.getCurrency(state).getOrElse('USD')
  const accounts = formValueSelector('exchange')(state, 'accounts')
  const amount = formValueSelector('exchange')(state, 'amount')
  const effectiveBalance = formValueSelector('exchange')(state, 'effectiveBalance')
  const source = prop('source', accounts)
  const sourceAmount = prop('source', amount)
  const sourceCoin = prop('coin', source)
  const target = prop('target', accounts)
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
      amount: { source: '', target: '' }
    },
    elements: [
      { group: 'Bitcoin', items: btcAccountsInfo.map(x => ({ text: x.label, value: x })) },
      { group: 'Ethereum', items: ethAccountsInfo.map(x => ({ text: x.label, value: x })) }
    ],
    btcFee,
    ethFee,
    currency,
    source,
    sourceCoin,
    sourceAmount,
    target,
    targetCoin,
    targetAmount,
    pair,
    effectiveBalance
  }
}
