import { curry, compose, lensProp, set } from 'ramda'
import { traversed, traverseOf } from 'ramda-lens'
import Task from 'data.task'
import { Wrapper, Wallet } from '../types'
import * as Coin from '../coinSelection/coin'

export const addHDWalletWIFS = curry(
  (securityModule, network, secondPassword, wrapper, selection) => {
    const wallet = Wrapper.selectWallet(wrapper)
    const deriveKey = coin =>
      Wallet.getHDPrivateKeyWIF(
        securityModule,
        coin.path,
        secondPassword,
        network,
        wallet
      )
        // .map(wif => Bitcoin.ECPair.fromWIF(wif, network))
        .map(wif => set(Coin.priv, wif, coin))
    const selectionWithKeys = traverseOf(
      compose(
        lensProp('inputs'),
        traversed
      ),
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
      compose(
        lensProp('inputs'),
        traversed
      ),
      Task.of,
      getPriv,
      selection
    )
    return selectionWithKeys
  }
)
