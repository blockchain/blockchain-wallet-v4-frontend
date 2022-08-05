import SafeEventEmitter from '@metamask/safe-event-emitter'
import { ethErrors } from 'eth-rpc-errors'
import { Duplex } from 'stream'

import {
  ConnectionEvents,
  Maybe,
  ProviderConnectInfo,
  ProviderMessage,
  ProviderMessageData,
  RequestArguments,
  StandardEvents
} from './types'
import {
  messages,
  SupportedRPCMethods,
  validateSendTransactionRequestParams,
  validateSignMessageRequestParams
} from './utils'

export class BCDCInpageProvider extends SafeEventEmitter {
  private connection: Duplex

  public isConnected = false

  public isBCDC: boolean

  public chainId: string | null = null

  constructor(connectionStream: Duplex) {
    super()
    this.connection = connectionStream
    this.isBCDC = true

    this.setConnectionHandler()
  }

  /**
   * Submits an RPC request for the given method, with the given params.
   * Resolves with the result of the method call, or rejects on error.
   *
   * @param args - The RPC request arguments.
   * @param args.method - The RPC method name.
   * @param args.params - The parameters for the RPC method.
   * @returns A Promise that resolves with the result of the RPC method,
   * or rejects if an error is encountered.
   */
  public async request<T>(args: RequestArguments): Promise<Maybe<T>> {
    if (!this.isConnected) {
      throw ethErrors.provider.disconnected({
        message: messages.errors.permanentlyDisconnected()
      })
    }

    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      throw ethErrors.rpc.invalidRequest({
        data: args,
        message: messages.errors.invalidRequestArgs()
      })
    }

    const { method, params } = args

    if (typeof method !== 'string' || method.length === 0) {
      throw ethErrors.rpc.invalidRequest({
        data: args,
        message: messages.errors.invalidRequestMethod()
      })
    }

    if (
      params !== undefined &&
      !Array.isArray(params) &&
      (typeof params !== 'object' || params === null)
    ) {
      throw ethErrors.rpc.invalidRequest({
        data: args,
        message: messages.errors.invalidRequestParams()
      })
    }

    if (!Object.values(SupportedRPCMethods).includes(method as SupportedRPCMethods)) {
      throw ethErrors.provider.unsupportedMethod({
        message: messages.errors.unsupportedRPCMethod(method)
      })
    }

    switch (method as SupportedRPCMethods) {
      case SupportedRPCMethods.SendTransaction:
        validateSendTransactionRequestParams(params)
        break
      case SupportedRPCMethods.SignMessage:
        validateSignMessageRequestParams(params)
        break
      default:
        break
    }

    this.connection.write(args)

    return new Promise<T>((resolve, reject) => {
      const listener = (msg: ProviderMessage | string) => {
        this.connection.removeListener('data', listener)

        if (typeof msg === 'string') {
          return
        }

        if (!msg.data) {
          reject(
            ethErrors.provider.userRejectedRequest({
              message: messages.errors.userRejectedRequest()
            })
          )
        }

        if (msg.type === SupportedRPCMethods.RequestAccounts) {
          this.emit(StandardEvents.AccountsChanged, [msg.data as T])
        }

        resolve(msg.data as T)
      }

      this.connection.on('data', listener)
    })
  }

  public on(eventName: string, listener: (...args: unknown[]) => void) {
    return super.on(eventName, listener)
  }

  public removeListener(eventName: string, listener: (...args: unknown[]) => void) {
    return super.removeListener(eventName, listener)
  }

  private setConnectionHandler(): void {
    this.connection.on('close', () => {
      this.isConnected = false
      throw ethErrors.provider.disconnected({
        message: messages.errors.permanentlyDisconnected()
      })
    })

    this.connection.on('data', (msg: ProviderMessage | string) => {
      if (typeof msg === 'string') return

      if (msg.type === ConnectionEvents.Disconnected) {
        this.isConnected = false
        throw ethErrors.provider.disconnected({
          message: messages.errors.permanentlyDisconnected()
        })
      }

      if (this.isConnected) return

      if (msg.type === ConnectionEvents.Connected) {
        this.isConnected = true

        const { chainId } = msg.data as ProviderConnectInfo

        this.emit(ConnectionEvents.Connected, { message: messages.info.connected(chainId) })
        this.emit(StandardEvents.ChainChanged, this.chainId)
        this.chainId = chainId
      }

      if (msg.type === ConnectionEvents.Error) {
        const data = msg.data as ProviderMessageData

        if (data.code) {
          throw ethErrors.provider.custom({
            code: data.code,
            message: data.message
          })
        }

        throw ethErrors.provider.custom({
          code: 1001,
          message: msg.data as string
        })
      }
    })
  }
}

/**
 * Sets the given provider instance as window.ethereum
 */
function setGlobalProvider(providerInstance: BCDCInpageProvider): void {
  // eslint-disable-next-line
  (window as any).ethereum = providerInstance
}

export function initializeProvider(stream: Duplex): void {
  const provider = new BCDCInpageProvider(stream)

  setGlobalProvider(provider)
}
