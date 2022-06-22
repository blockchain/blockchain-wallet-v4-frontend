export type NabuApiErrorType = {
  description: string
  type: string
}

export type Await<T> = T extends PromiseLike<infer U> ? U : T

export type ToDiscriminatedUnion<T> = { [K in keyof T]: { type: K; value: T[K] } }[keyof T]
