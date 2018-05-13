import { map } from 'ramda'

import { selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'

export const getData = state => {
  const defaultId = Types.HDWallet.selectDefaultAccountIdx(Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0))
  const wallets = map(x => ({
    label: x.label,
    index: x.index,
    archived: x.archived,
    default: defaultId === x.index,
    balance: x.info ? x.info.final_balance : 0,
    xpub: x.xpub
  }))

  return selectors.core.common.bitcoin.getActiveHDAccounts(state).map(wallets)
}
