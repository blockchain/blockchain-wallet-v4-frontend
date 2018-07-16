import Bitcoin from 'bitcoinjs-lib'
import memoize from 'fast-memoize'
import { is, pipe } from 'ramda'
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

const _getAddress = (cache, chain, index, network) => {
  const derive = c => {
    const xpub = chain === 1 ? selectChangeAccount(c) : selectReceiveAccount(c)
    return Bitcoin.HDNode.fromBase58(xpub, network).derive(index).getAddress()
  }
  return pipe(Cache.guard, derive)(cache)
}
export const getAddress = memoize(_getAddress)

export const fromJS = (x) => is(Cache, x) ? x : new Cache(x)

export const toJS = pipe(Cache.guard, iToJS)

export const reviver = (jsObject) => {
  return new Cache(jsObject)
}

export const js = (node) => {
  const receiveAccount = node ? node.derive(0).neutered().toBase58() : ''
  const changeAccount = node ? node.derive(1).neutered().toBase58() : ''
  return { receiveAccount, changeAccount }
}
