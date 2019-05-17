import { addIndex, map, pipe, is } from 'ramda'
import List from './List'
import { iLensProp } from './util'
import * as Derivation from './Derivation'

export class DerivationList extends List {}

const mapIndexed = addIndex(map)

export const derivation = iLensProp

export const createNew = derivations => {
  return new DerivationList(derivations)
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

export const toJSwithIndex = pipe(
  DerivationList.guard,
  derivations => {
    return map(Derivation.toJSwithIndex, derivations).toArray()
  }
)

export const reviver = jsObject => {
  return new DerivationList(jsObject)
}
