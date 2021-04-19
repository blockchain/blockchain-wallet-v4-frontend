import Task from 'data.task'
import { compose, curry, lensProp, set } from 'ramda'
import { traversed, traverseOf } from 'ramda-lens'

import * as Coin from '../coinSelection/coin'
import { Wallet, Wrapper } from '../types'

// addHDWalletWIFS :: network -> password -> wrapper -> selection -> Task selection
export const addHDWalletWIFS = curry(
  (network, secondPassword, wrapper, selection) => {
    const wallet = Wrapper.selectWallet(wrapper)
    const deriveKey = coin =>
      Wallet.getHDPrivateKeyWIF(coin, secondPassword, network, wallet)
        // .map(wif => Bitcoin.ECPair.fromWIF(wif, network))
        .map(wif => set(Coin.priv, wif, coin))
    const selectionWithKeys = traverseOf(
      compose(lensProp('inputs'), traversed),
      Task.of,
      deriveKey,
      selection
    )
    return selectionWithKeys
  }
)

// addLegacyWIFS :: network -> password -> wrapper -> selection -> Task selection
export const addLegacyWIFS = curry(
  (network, secondPassword, wrapper, selection) => {
    const wallet = Wrapper.selectWallet(wrapper)
    const getPriv = coin =>
      Wallet.getLegacyPrivateKeyWIF(
        coin.address,
        secondPassword,
        network,
        wallet
      ).map(wif => set(Coin.priv, wif, coin))
    const selectionWithKeys = traverseOf(
      compose(lensProp('inputs'), traversed),
      Task.of,
      getPriv,
      selection
    )
    return selectionWithKeys
  }
)
