import Task from 'data.task'
import { compose, curry, dissoc, is, over, pipe } from 'ramda'
import { traverseOf, view } from 'ramda-lens'

import * as crypto from '../walletCrypto'
import * as AddressLabelMap from './AddressLabelMap'
import * as Cache from './Cache'
import Type from './Type'

export class Derivation extends Type {}

export const xpriv = Derivation.define('xpriv')
export const xpub = Derivation.define('xpub')
export const addressLabels = Derivation.define('address_labels')
export const cache = Derivation.define('cache')
export const type = Derivation.define('type')
export const purpose = Derivation.define('purpose')

// Lens used to traverse all secrets for double encryption
export const secretsLens = xpriv

export const selectCache = view(cache)
export const selectXpriv = view(xpriv)
export const selectXpub = view(xpub)
export const selectAddressLabels = view(addressLabels)
export const selectType = view(type)
export const selectPurpose = view(purpose)

export const fromJS = derivation => {
  if (is(Derivation, derivation)) {
    return derivation
  } else {
    const derivationCons = compose(
      over(addressLabels, AddressLabelMap.fromJS),
      over(cache, Cache.fromJS)
    )
    return derivationCons(new Derivation(derivation))
  }
}

export const toJS = pipe(Derivation.guard, derivation => {
  const derivationDecons = compose(
    over(addressLabels, AddressLabelMap.toJS),
    over(cache, Cache.toJS)
  )
  return dissoc('index', derivationDecons(derivation).toJS())
})

export const js = (type, purpose, node, xpub) => ({
  type,
  purpose,
  xpriv: node ? node.toBase58() : '',
  xpub: node ? node.neutered().toBase58() : xpub,
  address_labels: [],
  cache: node ? Cache.js(node, null) : Cache.js(null, xpub)
})

export const reviver = jsObject => {
  return new Derivation(jsObject)
}

// encrypt :: Number -> String -> String -> Account -> Task Error Derivation
export const encrypt = curry((iterations, sharedKey, password, derivation) => {
  const cipher = crypto.encryptSecPass(sharedKey, iterations, password)
  return traverseOf(secretsLens, Task.of, cipher, derivation)
})

// decrypt :: Number -> String -> String -> Account -> Task Error Derivation
export const decrypt = curry((iterations, sharedKey, password, derivation) => {
  const cipher = crypto.decryptSecPass(sharedKey, iterations, password)
  return traverseOf(secretsLens, Task.of, cipher, derivation)
})
