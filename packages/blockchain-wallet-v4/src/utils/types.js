// @flow
import {call} from 'redux-saga/effects'

export type Saga<T> = Generator<*, T, *>

export function * callP<Args: Array<*>, T> (fn: (...args: Args) => Promise<T>, ...args: Args): Generator<*, T, *> {
  return yield call(fn, ...args)
}

export function * callG<Args: Array<*>, T> (fn: (...args: Args) => Generator<*, T, *>, ...args: Args): Generator<*, T, *> {
  return yield call(fn, ...args)
}

// eslint-disable-next-line no-unused-vars
type Return_<R, F: (...args: Array<any>) => R> = R;
type Return<T> = Return_<*, T>;

type ActionCreatorF = <A>(A) => {type: $PropertyType<Return<A>, 'type'>, payload: $Exact<$PropertyType<Return<A>, 'payload'>> }
export type ActionCreatorObj<A> = $Values<$ObjMap<A, ActionCreatorF>>
