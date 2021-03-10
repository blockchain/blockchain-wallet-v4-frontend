import { map, pathOr } from 'ramda'

import { Types } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

const getDefaultIdx = state =>
  Types.HDWallet.selectDefaultAccountIdx(
    Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0)
  )
const prepareWallet = (wallet, idx) => ({
  label: wallet.label,
  index: wallet.index,
  archived: wallet.archived,
  default: idx === wallet.index,
  balance: pathOr(0, ['info', 'final_balance'], wallet),
  xpub: wallet.xpub
})

export const getData = state => {
  const defaultIdx = getDefaultIdx(state)
  const wallets = map(wallet => prepareWallet(wallet, defaultIdx))
  return selectors.core.common.btc.getHDAccounts(state).map(wallets)
}

export const getWalletsWithoutRemoteData = state => {
  const defaultIdx = getDefaultIdx(state)
  const wallets = wallet => prepareWallet(wallet, defaultIdx)
  return selectors.core.wallet.getHDAccounts(state).map(wallets)
}
