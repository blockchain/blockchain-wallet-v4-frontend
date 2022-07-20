export interface RequestArguments {
  /** The RPC method to request. */
  method: string

  /** The params of the RPC method, if any. */
  params?: unknown[] | Record<string, unknown>
}

export interface ProviderMessage {
  readonly data: unknown
  readonly type: string
}

export interface ProviderConnectInfo {
  readonly chainId: string
}

export type Maybe<T> = Partial<T> | null | undefined

export enum ConnectionEvents {
  Connected = 'connected',
  Disconnected = 'disconnected'
}

export enum StandardEvents {
  AccountsChanged = 'accountsChanged',
  ChainChanged = 'chainChanged'
}
