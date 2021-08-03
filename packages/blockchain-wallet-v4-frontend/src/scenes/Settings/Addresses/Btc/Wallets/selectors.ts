import { isNil, map, pathOr, pipe, pluck, prop, reject, sum } from 'ramda'

import { Types } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

const getDefaultIdx = (state) =>
  Types.HDWallet.selectDefaultAccountIdx(
    Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0)
  )
const prepareWallet = (wallet, idx) => ({
  archived: wallet.archived,
  balance: wallet.derivations
    ? pipe(
        prop('derivations'),
        // @ts-ignore
        pluck('info'),
        pluck('final_balance'),
        reject(isNil),
        sum
      )(wallet)
    : pathOr(0, ['info', 'final_balance'], wallet),
  default: idx === wallet.index,
  index: wallet.index,
  label: wallet.label,
  type: 'v4',
  xpub: wallet.xpub
})

export const getData = (state) => {
  const defaultIdx = getDefaultIdx(state)
  const wallets = map((wallet) => prepareWallet(wallet, defaultIdx))
  return selectors.core.common.btc.getHDAccounts(state).map(wallets)
}

export const getWalletsWithoutRemoteData = (state) => {
  const defaultIdx = getDefaultIdx(state)
  const wallets = (wallet) => prepareWallet(wallet, defaultIdx)
  return selectors.core.wallet.getHDAccounts(state).map(wallets)
}
