import { toCashAddr } from './bch'
import { isValidBitcoinAddress } from './btc'
import { map, length, take } from 'ramda'

// Adding account names for btc forks (bch, bsv)
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
            } else if (isValidBitcoinAddress(tx.from)) {
              try {
                tx.from = toCashAddr(tx.from, true)
              } catch (e) {}
            }
            if (account.label === tx.to) {
              tx.to = accountList[index].label
            } else if (isValidBitcoinAddress(tx.to)) {
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
