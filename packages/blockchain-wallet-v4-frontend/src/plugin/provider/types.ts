import { providers } from 'ethers'

export interface RequestArguments {
  /** The RPC method to request. */
  method: string

  /** The params of the RPC method, if any. */
  params?: unknown[] | Record<string, unknown> | providers.TransactionRequest
}

export interface ProviderMessage {
  readonly data: unknown
  readonly type: string
}

export type ProviderMessageData = string & {
  code: number
  message: string
}

export interface ProviderConnectInfo {
  readonly chainId: string
}

export type Maybe<T> = Partial<T> | null | undefined

export enum ConnectionEvents {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Error = 'error'
}

export enum StandardEvents {
  AccountsChanged = 'accountsChanged',
  ChainChanged = 'chainChanged'
}
