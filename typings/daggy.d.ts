declare module 'daggy' {
  import { RemoteFailure, RemoteLoading, RemoteNotAsked, RemoteSuccess } from '@core/remote/types'

  interface IConstructor {
    Failure: ['error']
    Loading: []
    NotAsked: []
    Success: ['data']
  }

  interface _RemoteSuccess {
    is: (data: any) => boolean
    <A>(data: A): RemoteSuccess<A>
  }

  interface _RemoteFailure {
    is: (data: any) => boolean
    <E>(error: E): RemoteFailure<E>
  }

  interface DaggyRemoteI {
    is: (data: any) => boolean
  }

  class _Remote {
    '@@type': 'Remote'

    Failure: _RemoteFailure

    Loading: DaggyRemoteI & RemoteLoading

    NotAsked: DaggyRemoteI & RemoteNotAsked

    Success: _RemoteSuccess

    of: <A>(data: A) => _RemoteSuccess<A>

    prototype: any

    toString: () => void
  }

  export function taggedSum(typename: string, constructor: IConstructor): _Remote
}
