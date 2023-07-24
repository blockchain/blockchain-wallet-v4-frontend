import Remote from './index'

const cata = function <E, A, R>(
  this: RemoteDataType<E, A>,
  obj: {
    Failure: (error: E) => R
    Loading: () => R
    NotAsked: () => R
    Success: (data: A) => R
  }
): R {
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
    default:
      return obj.Success(this.data)
  }
}

const getOrElse = function <A, DV>(this: RemoteDataType<any, A>, defaultValue: DV): DV | A {
  return this.data || defaultValue
}

const getOrFail = function <A, EV>(this: RemoteDataType<any, A>, errorValue: EV): A {
  if (!this.data) {
    throw errorValue
  } else {
    return this.data
  }
}

const map = function <E, A, T>(
  this: RemoteDataType<E, A>,
  f: (x: A) => T
): RemoteDataType<E, ReturnType<typeof f>> {
  return Remote.Success(f(this.data))
}

export interface RemoteType {
  cata: typeof cata
  getOrElse: typeof getOrElse
  getOrFail: typeof getOrFail
  map: typeof map
}

export type RemoteNotAsked = RemoteType & {
  readonly '@@tag': 'RemoteNotAsked'
  readonly '@@values': []
  readonly data: never
}

export type RemoteLoading = RemoteType & {
  readonly '@@tag': 'RemoteLoading'
  readonly '@@values': []
  readonly data: never
}

export type RemoteFailure<E> = RemoteType & {
  readonly '@@tag': 'RemoteFailure'
  readonly '@@values': [E]
  readonly data: never
  readonly error: E
}

export type RemoteSuccess<A> = RemoteType & {
  readonly '@@tag': 'RemoteSuccess'
  readonly '@@values': [A]
  readonly data: A
}

export type RemoteDataType<E, A> =
  | RemoteNotAsked
  | RemoteLoading
  | RemoteFailure<E>
  | RemoteSuccess<A>
export type ExtractSuccess<T> = T extends RemoteSuccess<infer A> ? A : never
export type ExtractFailure<T> = T extends RemoteFailure<infer E> ? E : never
