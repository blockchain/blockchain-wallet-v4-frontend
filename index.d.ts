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

declare module 'react-intl' {
  import { StatelessComponent } from 'react'

  export const injectIntl

  export const FormattedMessage: StatelessComponent<{
    id: string
    className?: string
    defaultMessage: string
    values?: any
  }>

  export const FormattedHTMLMessage: StatelessComponent<{
    id: string
    defaultMessage: string
    values?: any
  }>
}

declare module '*.png'
declare module '*.svg'
declare module '*.gif'
declare module '*.jpg'
