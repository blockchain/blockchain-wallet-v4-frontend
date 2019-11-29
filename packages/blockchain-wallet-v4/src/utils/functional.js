import Task from 'data.task'
import { compose } from 'ramda'
import { call } from 'redux-saga/effects'

// Used as default value for functions
export const noop = () => {}

export const promiseToTask = promise =>
  new Task((reject, resolve) => promise.then(resolve, reject))

export const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

// Transform a function that returns a promise into one that returns a Task.
export const returnTask = func => {
  const newFunction = (...args) => promiseToTask(func(...args))
  Object.defineProperty(newFunction, `length`, { value: func.length })
  return newFunction
}

export const callTask = function * (task) {
  return yield call(
    compose(
      taskToPromise,
      () => task
    )
  )
}
