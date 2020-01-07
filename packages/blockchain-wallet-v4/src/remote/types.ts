export type RemoteNotAsked = {
  readonly '@@tag': 'RemoteNotAsked'
  readonly '@@values': []
}

export type RemoteLoading = {
  readonly '@@tag': 'RemoteLoading'
  readonly '@@values': []
}

export type RemoteFailure<E> = {
  readonly '@@tag': 'RemoteFailure'
  readonly '@@values': [E]
  readonly error: E
}

export type RemoteSuccess<A> = {
  readonly '@@tag': 'RemoteSuccess'
  readonly '@@values': [A]
  readonly data: A
}

export type RemoteData<E, A> =
  | RemoteNotAsked
  | RemoteLoading
  | RemoteFailure<E>
  | RemoteSuccess<A>
