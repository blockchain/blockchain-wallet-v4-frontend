import { view, is, pipe, curry } from 'ramda'
import Type from './Type'

export class TXNotes extends Type {}

export const isTXNotes = is(TXNotes)

export const note = txhash => TXNotes.define(txhash)

export const selectNote = curry((txhash, txnotes) => view(note(txhash), txnotes))

export const toJS = pipe(TXNotes.guard, (txnotes) => {
  return txnotes.toObject()
})

export const fromJS = (object) => {
  if (isTXNotes(object)) {
    return object
  } else {
    return new TXNotes(object)
  }
}

export const reviver = (object) => {
  return new TXNotes(object)
}
