// not used but still in payload
import { is, pipe } from 'ramda'

// import { view } from 'ramda-lens'
import List from './List'

export class TXNames extends List {}

export const isTXNames = is(TXNames)

export const toJS = pipe(TXNames.guard, txnames => {
  return txnames.toArray()
})

export const fromJS = object => {
  if (isTXNames(object)) {
    return object
  } else {
    return new TXNames(object)
  }
}

export const reviver = object => {
  return new TXNames(object)
}
