// @flow

type State = 'success' | 'failure' | 'loading' | 'notasked'

export type RemoteCataFn<T> = {
  Success: T => Object,
  Failure: Object => Object,
  Loading: () => Object,
  NotAsked: () => Object
}

export interface RemoteI<T> {
  state: State,
  map<F>(fn: T => F): RemoteI<F>,

  ap<F>(r: RemoteI<F>): RemoteI<any>,
  chain<F>(fn: T => RemoteI<F>): RemoteI<F>,

  getOrElse(def: T): T,

  cata(fn: RemoteCataFn<T>): Object
}

class RemoteSuccess<T> {
  data: T
  state: State = 'success'

  constructor (data: T) {
    this.data = data
  }

  map<F> (f: T => F): RemoteI<F> {
    return new RemoteSuccess(f(this.data))
  }

  getOrElse (def: T): T {
    return this.data
  }

  cata (fn: RemoteCataFn<T>): Object {
    return fn.Success(this.data)
  }

  ap<F> (r: RemoteI<F>): RemoteI<any> {
    const t: any = this.data // TODO implement type checking for T
    return r.map(t)
  }

  chain<F> (fn: T => RemoteI<F>): RemoteI<F> {
    return fn(this.data)
  }
}

export class RemoteFailure<T> {
  error: Object
  state: State = 'failure'

  constructor (error: Object) {
    this.error = error
  }

  map<F> (f: T => F): RemoteI<F> {
    return new RemoteFailure(this.error)
  }

  getOrElse (def: T): T {
    return def
  }

  cata (fn: RemoteCataFn<T>): Object {
    return fn.Failure(this.error)
  }

  ap<F> (that: RemoteI<F>): RemoteI<any> {
    return that.cata({
      Success: (f) => this,
      Failure: () => this,
      Loading: () => this,
      NotAsked: () => that
    })
  }

  chain<F> (fn: T => RemoteI<F>): RemoteI<F> {
    return new RemoteFailure(this.error)
  }
}

export class RemoteLoading<T> {
  state: State = 'loading'

  map<F> (f: T => F): RemoteI<F> {
    return new RemoteLoading()
  }

  getOrElse (def: T): T {
    return def
  }

  cata (fn: RemoteCataFn<T>): Object {
    return fn.Loading()
  }

  ap<F> (that: RemoteI<F>): RemoteI<any> {
    return that.cata({
      Success: (f) => this,
      Failure: () => that,
      Loading: () => that,
      NotAsked: () => that
    })
  }

  chain<F> (fn: T => RemoteI<F>): RemoteI<F> {
    return new RemoteLoading()
  }
}

export class RemoteNotAsked<T> {
  state: State = 'notasked'

  map<F> (f: T => F): RemoteI<F> {
    return new RemoteNotAsked()
  }

  getOrElse (def: T): T {
    return def
  }

  cata (fn: RemoteCataFn<T>): Object {
    return fn.NotAsked()
  }

  ap<F> (that: RemoteI<F>): RemoteI<any> {
    return this
  }

  chain<F> (fn: T => RemoteI<F>): RemoteI<F> {
    return new RemoteNotAsked()
  }
}

type RemoteW = {
  Success: (data: *) => RemoteSuccess<*>,
  Failure: (error: *) => RemoteFailure<*>,
  Loading: RemoteLoading<*>,
  NotAsked: RemoteNotAsked<*>
}

const Remote: RemoteW = {
  Success: (data: *): * => new RemoteSuccess(data),
  of: (data: *): * => new RemoteSuccess(data),
  Failure: (error: *): * => new RemoteFailure(error),
  Loading: new RemoteLoading(),
  NotAsked: new RemoteNotAsked(),
  SuccessIs: (remote: RemoteI<*>): boolean => remote.state === 'success',
  FailureIs: (remote: RemoteI<*>): boolean => remote.state === 'failure',
  LoadingIs: (remote: RemoteI<*>): boolean => remote.state === 'loading',
  NotAskedIs: (remote: RemoteI<*>): boolean => remote.state === 'notasked'
}

export default Remote
