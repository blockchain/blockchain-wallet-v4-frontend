import { concat, head, path } from 'ramda'
import { selectors } from 'data'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const btcHDAccountsInfo = selectors.core.common.bitcoin.getAccountsInfo(state)
  const btcAddressesInfo = selectors.core.common.bitcoin.getAddressesInfo(state)
  const btcAccountsInfo = concat(btcHDAccountsInfo, btcAddressesInfo)
  const ethAccountsInfo = selectors.core.common.ethereum.getAccountsInfo(state).getOrElse([])
  const defaultBtcAccount = head(btcAccountsInfo)
  const defaultEthAccount = head(ethAccountsInfo)
  const currency = selectors.core.settings.getCurrency(state).getOrElse('USD')
  const accounts = formValueSelector('exchange')(state, 'accounts')
  const amount = formValueSelector('exchange')(state, 'amount')
  const sourceCoin = path(['source', 'coin'], accounts) || 'BTC'
  const targetCoin = path(['target', 'coin'], accounts) || 'ETH'
  const defaultAccounts = {
    BTC: defaultBtcAccount,
    ETH: defaultEthAccount
  }

  return ({
    defaultAccounts,
    initialValues: {
      accounts: { source: defaultBtcAccount, target: defaultEthAccount },
      amount: { source: 0, target: 0 }
    },
    elements: [
      { group: 'Bitcoin', items: btcAccountsInfo.map(x => ({ text: x.label, value: x })) },
      { group: 'Ethereum', items: ethAccountsInfo.map(x => ({ text: x.label, value: x })) }
    ],
    btcAccountsInfo,
    ethAccountsInfo,
    currency,
    accounts,
    amount,
    sourceCoin,
    targetCoin
  })
}
