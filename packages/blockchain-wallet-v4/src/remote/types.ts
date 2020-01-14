const cata = function<E, A> (
  this: RemoteData<E, A>,
  obj: {
    Failure: (error: E) => E | React.ReactNode
    Loading: () => React.ReactNode
    NotAsked: () => React.ReactNode
    Success: (data: A) => A | React.ReactNode
  }
): E | A | React.ReactNode {
  switch (this['@@tag']) {
    case 'RemoteNotAsked': {
      return obj.NotAsked()
    }
    case 'RemoteLoading': {
      return obj.Loading()
    }
    case 'RemoteFailure': {
      return obj.Failure(this.error)
    }
    case 'RemoteSuccess': {
      return obj.Success(this.data)
    }
  }
}

const getOrElse = function<A, DV> (
  this: RemoteData<any, A>,
  defaultValue: DV
): DV | A {
  switch (this['@@tag']) {
    case 'RemoteNotAsked': {
      return defaultValue
    }
    case 'RemoteLoading': {
      return defaultValue
    }
    case 'RemoteFailure': {
      return defaultValue
    }
    case 'RemoteSuccess': {
      return this.data
    }
  }
}

export type RemoteNotAsked = {
  readonly '@@tag': 'RemoteNotAsked'
  readonly '@@values': []
  cata: typeof cata
  getOrElse: typeof getOrElse
}

export type RemoteLoading = {
  readonly '@@tag': 'RemoteLoading'
  readonly '@@values': []
  cata: typeof cata
  getOrElse: typeof getOrElse
}

export type RemoteFailure<E> = {
  readonly '@@tag': 'RemoteFailure'
  readonly '@@values': [E]
  cata: typeof cata
  readonly error: E
  getOrElse: typeof getOrElse
}

export type RemoteSuccess<A> = {
  readonly '@@tag': 'RemoteSuccess'
  readonly '@@values': [A]
  cata: typeof cata
  readonly data: A
  getOrElse: typeof getOrElse
}

export type RemoteData<E, A> =
  | RemoteNotAsked
  | RemoteLoading
  | RemoteFailure<E>
  | RemoteSuccess<A>
