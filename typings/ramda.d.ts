/* eslint-disable */
import * as ramda from 'ramda'
import { RemoteDataType } from 'core/types'

declare module 'ramda' {
  export function lift<T>(
    f: (...args: any[]) => T
  ): (...Fx) => RemoteDataType<any, ReturnType<typeof f>> {
    return Fx => Fx.map(f)
  }
}
