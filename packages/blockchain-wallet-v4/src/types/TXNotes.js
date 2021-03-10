import { curry, is, pipe } from 'ramda'
import { view } from 'ramda-lens'

import Type from './Type'
import { iLensProp } from './util'

export class TXNotes extends Type {}

export const isTXNotes = is(TXNotes)

export const note = iLensProp

export const selectNote = curry((txhash, txnotes) =>
  pipe(TXNotes.guard, view(iLensProp(txhash)))(txnotes)
)

export const toJS = pipe(TXNotes.guard, txnotes => {
  return txnotes.toObject()
})

export const fromJS = object => {
  if (isTXNotes(object)) {
    return object
  } else {
    return new TXNotes(object)
  }
}

export const reviver = object => {
  return new TXNotes(object)
}
