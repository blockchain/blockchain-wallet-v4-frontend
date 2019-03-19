import { selectors } from 'data'
import { Wallet, TXNotes } from 'blockchain-wallet-v4/src/types'

// TODO: delete all dis
export const getDescription = (state, ownProps) => {
  const { coin, hash, toAddress } = ownProps
  switch (coin) {
    case 'BTC': {
      const wallet = selectors.core.wallet.getWallet(state)
      const addressLabel = selectors.core.kvStore.btc
        .getAddressLabel(toAddress, state)
        .getOrElse('')
      return (
        TXNotes.selectNote(hash, Wallet.selectTxNotes(wallet)) || addressLabel
      )
    }
    case 'BCH': {
      const txNote = selectors.core.kvStore.bch.getBchTxNote(state, hash)
      return txNote.getOrElse('')
    }
    case 'BSV': {
      const txNote = selectors.core.kvStore.bsv.getBsvTxNote(state, hash)
      return txNote.getOrElse('')
    }
    case 'ETH': {
      const txNote = selectors.core.kvStore.eth.getEthTxNote(state, hash)
      return txNote.getOrElse('')
    }
    case 'XLM': {
      const txNote = selectors.core.kvStore.xlm.getXlmTxNote(state, hash)
      return txNote.getOrElse('')
    }
  }
}
