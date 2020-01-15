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

export type RemoteType = {
  cata: typeof cata
  getOrElse: typeof getOrElse
}

export type RemoteNotAsked = RemoteType & {
  readonly '@@tag': 'RemoteNotAsked'
  readonly '@@values': []
}

export type RemoteLoading = RemoteType & {
  readonly '@@tag': 'RemoteLoading'
  readonly '@@values': []
}

export type RemoteFailure<E> = RemoteType & {
  readonly '@@tag': 'RemoteFailure'
  readonly '@@values': [E]
  readonly error: E
}

export type RemoteSuccess<A> = RemoteType & {
  readonly '@@tag': 'RemoteSuccess'
  readonly '@@values': [A]
  readonly data: A
}

export type RemoteData<E, A> =
  | RemoteNotAsked
  | RemoteLoading
  | RemoteFailure<E>
  | RemoteSuccess<A>
