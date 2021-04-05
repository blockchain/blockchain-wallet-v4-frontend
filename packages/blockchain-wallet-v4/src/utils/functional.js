import { compose } from 'ramda'
import { call } from 'redux-saga/effects'

// Used as default value for functions
export const noop = () => {}

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export const callTask = function * (task) {
  return yield call(compose(taskToPromise, () => task))
}
