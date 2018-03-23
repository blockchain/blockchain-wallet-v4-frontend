import {call} from "redux-saga/effects";

export type Saga<T> = Generator<*, T, *>

export function* callP<Args: Array<*>, T>(fn: (...args: Args) => Promise<T>, ...args: Args): Generator<*, T, *> {
  return yield call(fn, ...args);
}

export function* callG<Args: Array<*>, T>(fn: (...args: Args) => Generator<*, T, *>, ...args: Args): Generator<*, T, *> {
  return yield call(fn, ...args);
}