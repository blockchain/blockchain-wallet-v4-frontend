declare module 'blockchain-info-components' {
  import { DefaultTheme } from 'styled-components'
  // type-coverage:ignore-next-line
  export function Icon(...args: any): any
  // type-coverage:ignore-next-line
  export function Text(...args: any): any
  // type-coverage:ignore-next-line
  export function Button(...args: any): any
  // type-coverage:ignore-next-line
  export function Link(...args: any): any

  // type-coverage:ignore-next-line
  export function FontGlobalStyles(...args: any): any
  // type-coverage:ignore-next-line
  export function IconGlobalStyles(...args: any): any

  export function Palette(theme: string): DefaultTheme
}
declare module 'daggy' {
  import {
    RemoteFailure,
    RemoteLoading,
    RemoteNotAsked,
    RemoteSuccess
  } from 'blockchain-wallet-v4/src/remote/types'
  interface IConstructor {
    Failure: ['error']
    Loading: []
    NotAsked: []
    Success: ['data']
  }

  export function taggedSum(
    typename: string,
    constructor: IConstructor
  ): {
    '@@type': 'Remote'
    Failure: <E>(error: E) => RemoteFailure<E>
    Loading: RemoteLoading
    NotAsked: RemoteNotAsked
    Success: <A>(data: A) => RemoteSuccess<A>
    is: () => boolean
    prototype: any
    toString: () => void
  }
}
