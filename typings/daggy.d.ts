declare module 'daggy' {
  import { RemoteFailure, RemoteLoading, RemoteNotAsked, RemoteSuccess } from '@core/remote/types'

  interface IConstructor {
    Failure: ['error']
    Loading: []
    NotAsked: []
    Success: ['data']
  }

  interface _RemoteSuccess {
    is: <A>(data: A) => data is RemoteSuccess<A>
    <A>(data: A): RemoteSuccess<A>
  }

  interface _RemoteFailure {
    is: <E>(data: E) => data is RemoteFailure<E>
    <E>(error: E): RemoteFailure<E>
  }

  interface _RemoteLoading extends RemoteLoading {
    is: (data: any) => data is RemoteLoading
  }

  interface DaggyRemoteI {
    is: (data: any) => boolean
  }

  class _Remote {
    '@@type': 'Remote'

    Failure: _RemoteFailure

    Loading: _RemoteLoading

    NotAsked: DaggyRemoteI & RemoteNotAsked

    Success: _RemoteSuccess

    of: <A>(data: A) => _RemoteSuccess<A>

    prototype: any

    toString: () => void
  }

  export function taggedSum(typename: string, constructor: IConstructor): _Remote
}
