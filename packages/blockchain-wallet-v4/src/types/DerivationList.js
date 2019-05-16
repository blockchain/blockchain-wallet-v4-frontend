import List from './List'
import { selectCache, selectType } from './Derivation'
export class DerivationList extends List {}

export const createNew = derivations => {
  return new DerivationList(derivations)
}

export const getCacheFromType = (derivations, type) => {
  DerivationList.guard(derivations)
  const derivation = derivations.find(d => selectType(d) === type)
  return selectCache(derivation)
}
