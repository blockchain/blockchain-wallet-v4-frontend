export const cata = <E, A>(obj: {
  Failure: (error: E) => E | React.ReactNode
  Loading: () => React.ReactNode
  NotAsked: () => React.ReactNode
  Success: (value: A) => A | React.ReactNode
}) => (ma: RemoteData<E, A>) => {
  switch (ma['@@tag']) {
    case 'RemoteNotAsked': {
      return obj.NotAsked()
    }
    case 'RemoteLoading': {
      return obj.Loading()
    }
    case 'RemoteFailure': {
      return obj.Failure(ma.error)
    }
    case 'RemoteSuccess': {
      return obj.Success(ma.data)
    }
  }
}

export type RemoteNotAsked = {
  readonly '@@tag': 'RemoteNotAsked'
  readonly '@@values': []
  cata: typeof cata
}

export type RemoteLoading = {
  readonly '@@tag': 'RemoteLoading'
  readonly '@@values': []
  cata: typeof cata
}

export type RemoteFailure<E> = {
  readonly '@@tag': 'RemoteFailure'
  readonly '@@values': [E]
  cata: typeof cata
  readonly error: E
}

export type RemoteSuccess<A> = {
  readonly '@@tag': 'RemoteSuccess'
  readonly '@@values': [A]
  cata: typeof cata
  readonly data: A
}

export type RemoteData<E, A> =
  | RemoteNotAsked
  | RemoteLoading
  | RemoteFailure<E>
  | RemoteSuccess<A>
