import { addIndex, is, lens, map, pipe } from 'ramda'

import * as Derivation from './Derivation'
import List from './List'
import { iLensProp } from './util'

export class DerivationList extends List {}

const mapIndexed = addIndex(map)

export const derivation = iLensProp

export const derivationOfType = type =>
  lens(
    x => x.find(d => Derivation.selectType(d) === type),
    (val, x) => x.map(d => (Derivation.selectType(d) === type ? val : d))
  )
export const getXpubsFromDerivations = derivations => {
  DerivationList.guard(derivations)
  return derivations.map(d => Derivation.selectXpub(d))
}
export const getXpubsAndTypesFromDerivations = derivations => {
  DerivationList.guard(derivations)
  return derivations.map(d => ({
    type: Derivation.selectType(d),
    xpub: Derivation.selectXpub(d)
  }))
}
export const getDerivationFromType = (derivations, type) => {
  DerivationList.guard(derivations)
  return derivations.find(d => Derivation.selectType(d) === type)
}

export const getCacheFromType = (derivations, type) => {
  DerivationList.guard(derivations)
  const derivation = getDerivationFromType(derivations, type)
  return Derivation.selectCache(derivation)
}

export const fromJS = derivations => {
  if (is(DerivationList, derivations)) {
    return derivations
  } else {
    return new DerivationList(mapIndexed(Derivation.fromJS, derivations))
  }
}

export const toJS = pipe(DerivationList.guard, derivations => {
  return map(Derivation.toJS, derivations).toArray()
})

export const reviver = jsObject => {
  return new DerivationList(jsObject)
}
