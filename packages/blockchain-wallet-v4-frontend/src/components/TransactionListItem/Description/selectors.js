import { selectors } from 'data'
import { Wallet, TXNotes } from 'blockchain-wallet-v4/src/types'

export const getDescription = (state, ownProps) => {
  const { coin, hash } = ownProps
  switch (coin) {
    case 'BTC': {
      const wallet = selectors.core.wallet.getWallet(state)
      return TXNotes.selectNote(hash, Wallet.selectTxNotes(wallet))
    }
  }
}
