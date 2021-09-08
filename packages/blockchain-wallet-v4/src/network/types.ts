export type NabuApiErrorType = {
  description: string
  type: string
}

export type Await<T> = T extends PromiseLike<infer U> ? U : T
