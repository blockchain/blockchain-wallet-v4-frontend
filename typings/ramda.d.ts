/* eslint-disable */
import * as ramda from 'ramda'
import { ExtractFailure, ExtractRemoteArray, RemoteDataType } from 'core/types'

declare module 'ramda' {
  export function lift<T>(
    f: (...args: any[]) => T
  ): <A>(
    ...Fx: ExtractRemoteArray<A[]>
  ) => // @ts-ignore
  RemoteDataType<ExtractFailure<A>, T> {
    // @ts-ignore
    return Fx => Fx.map(f)
  }
}
