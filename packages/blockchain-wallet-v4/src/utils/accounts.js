import { length, map, take } from 'ramda'

import { toCashAddr } from './bch'
import { isValidBtcAddress } from './btc'

// Adding account names for btc forks
// Wallet, kvStore Account List, txs -> txList
export const addFromToAccountNames = (wallet, accountList, txList) => {
  const hdWallets = wallet.hd_wallets
  map(
    tx =>
      hdWallets.map(hdWallet =>
        take(length(accountList), hdWallet.accounts).map((account, index) => {
          if (account) {
            if (account.label === tx.from) {
              tx.from = accountList[index].label
            } else if (isValidBtcAddress(tx.from)) {
              try {
                tx.from = toCashAddr(tx.from, true)
              } catch (e) {}
            }
            if (account.label === tx.to) {
              tx.to = accountList[index].label
            } else if (isValidBtcAddress(tx.to)) {
              try {
                tx.to = toCashAddr(tx.to, true)
              } catch (e) {}
            }
          }
        })
      ),
    txList
  )

  txList.map(tx => {
    tx.inputs.map(input => {
      input.address = toCashAddr(input.address, true)
    })
    tx.outputs.map(output => {
      output.address = toCashAddr(output.address, true)
    })
  })

  return txList
}
