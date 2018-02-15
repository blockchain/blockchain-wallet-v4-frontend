import { sequence, concat, map, head, lift, nth, reduce } from 'ramda'
import { selectors } from 'data'
// import { Remote } from 'blockchain-wallet-v4/src'

console.log('selectors', selectors)

export const getData = state => {
  const defaultBitcoinAccountIndex = selectors.core.wallet.getDefaultAccountIndex(state)
  const defaultEthereumAccountIndex = 0
  const bitcoinAccountsBalancesR = selectors.core.common.bitcoin.getAccountsBalances(state)
  const bitcoinAddressesBalancesR = selectors.core.common.bitcoin.getAddressesBalances(state)
  const bitcoinBalancesR = lift((btcAccounts, btcAddresses) => concat(btcAccounts, btcAddresses))(bitcoinAccountsBalancesR, bitcoinAddressesBalancesR)
  const ethereumBalancesR = selectors.core.common.ethereum.getAccountBalances(state)
  // const defaultBitcoinAccount = head(bitcoin)

  const transform = (bitcoinAccountsBalances, bitcoinAddressesBalances, bitcoinBalances, ethereumBalances) => {
    const defaultBitcoinAccount = nth(defaultBitcoinAccountIndex, bitcoinAccountsBalances)
    const defaultEthereumAccount = nth(defaultEthereumAccountIndex, ethereumBalances)

    return {
      initialValues: { source: defaultBitcoinAccount, target: defaultEthereumAccount },
      elements: [{
        group: 'Bitcoin',
        items: bitcoinBalances.map(x => ({ text: x.label, value: x }))
      }, {
        group: 'Ethereum',
        items: ethereumBalances.map(x => ({ text: x.label, value: x }))
      }]
    }
  }

  return lift(transform)(bitcoinAccountsBalancesR, bitcoinAddressesBalancesR, bitcoinBalancesR, ethereumBalancesR)
}

// export const getData = state => {
//   const toDropdown = map(x => ({ text: x.label, value: x || x.xpub }))
//   const toElements = (bitcoin, ethereum) => [{ group: 'Bitcoin', items: bitcoin }, { group: 'Ethereum', items: ethereum }]

//   return sequence(Remote.of, [
//     selectors.core.common.ethereum.getAccountBalances(state).map(toDropdown),
//     selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown),
//     selectors.core.common.bitcoin.getAddressesBalances(state).map(toDropdown)
//   ]).map(([e, b1, b2]) => ({ elements: toElements(concat(b1, b2), e), sourceDefault: head(e), targetDefault: head(b1) }))
// }
