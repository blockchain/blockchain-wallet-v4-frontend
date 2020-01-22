declare module 'blockchain-info-components' {
  import { DefaultTheme } from 'styled-components'

  // type-coverage:ignore-next-line
  export function BlockchainLoader(...args: any): any
  // type-coverage:ignore-next-line
  export function Button(...args: any): any
  // type-coverage:ignore-next-line
  export function FontGlobalStyles(...args: any): any
  // type-coverage:ignore-next-line
  export function HeartbeatLoader(...args: any): any
  // type-coverage:ignore-next-line
  export function Icon(...args: any): any
  // type-coverage:ignore-next-line
  export function IconGlobalStyles(...args: any): any
  // type-coverage:ignore-next-line
  export function Image(...args: any): any
  // type-coverage:ignore-next-line
  export function Link(...args: any): any
  // type-coverage:ignore-next-line
  export function Modal(...args: any): any
  // type-coverage:ignore-next-line
  export function ModalBody(...args: any): any
  // type-coverage:ignore-next-line
  export function ModalHeader(...args: any): any
  // type-coverage:ignore-next-line
  export function Palette(theme: string): DefaultTheme
  // type-coverage:ignore-next-line
  export function SkeletonRectangle(...args: any): any
  // type-coverage:ignore-next-line
  export function Table(...args): any
  // type-coverage:ignore-next-line
  export function TableCell(...args): any
  // type-coverage:ignore-next-line
  export function TableHeader(...args): any
  // type-coverage:ignore-next-line
  export function TableRow(...args): any
  // type-coverage:ignore-next-line
  export function Text(...args: any): any
  // type-coverage:ignore-next-line
  export function TextGroup(...args: any): any
  // type-coverage:ignore-next-line
  export function SpinningLoader(...args: any): any
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

  class Remote {
    '@@type': 'Remote'
    Failure: <E>(error: E) => RemoteFailure<E>
    Loading: RemoteLoading
    NotAsked: RemoteNotAsked
    Success: <A>(data: A) => RemoteSuccess<A>
    is: () => boolean
    prototype: any
    toString: () => void
  }

  export function taggedSum(typename: string, constructor: IConstructor): Remote
}
