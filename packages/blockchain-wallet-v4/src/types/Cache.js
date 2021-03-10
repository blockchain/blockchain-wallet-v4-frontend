import Bitcoin from 'bitcoinjs-lib'
import memoize from 'fast-memoize'
import { ifElse, is, pipe } from 'ramda'
import { view } from 'ramda-lens'

import Type from './Type'
import { iToJS } from './util'

/* AddressLabel :: {
  index :: Number
  label :: String
} */

export class Cache extends Type {}

export const isCache = is(Cache)

export const receiveAccount = Cache.define('receiveAccount')
export const changeAccount = Cache.define('changeAccount')

export const selectReceiveAccount = view(receiveAccount)
export const selectChangeAccount = view(changeAccount)

export const receiveChain = 0
export const changeChain = 1

const _getAddress = (cache, chain, index, network) => {
  const derive = c => {
    const node = getNode(c, chain, network)
    return node.derive(index).getAddress()
  }
  return pipe(Cache.guard, derive)(cache)
}
export const getAddress = memoize(_getAddress)

const _getNode = (cache, chain, network) =>
  pipe(
    Cache.guard,
    ifElse(
      () => chain === changeChain,
      selectChangeAccount,
      selectReceiveAccount
    ),
    xpub => Bitcoin.HDNode.fromBase58(xpub, network)
  )(cache)
export const getNode = memoize(_getNode)

export const fromJS = x => (is(Cache, x) ? x : new Cache(x))

export const toJS = pipe(Cache.guard, iToJS)

export const reviver = jsObject => {
  return new Cache(jsObject)
}

export const js = (node, xpub) => {
  node = xpub ? Bitcoin.HDNode.fromBase58(xpub) : node
  const receiveAccount = node
    ? node
        .derive(0)
        .neutered()
        .toBase58()
    : ''
  const changeAccount = node
    ? node
        .derive(1)
        .neutered()
        .toBase58()
    : ''
  return { receiveAccount, changeAccount }
}
