import { serializeError } from 'eth-rpc-errors'
import { providers, utils } from 'ethers'

export const messages = {
  errors: {
    invalidRequestArgs: () => `Expected a single, non-array, object argument.`,
    invalidRequestMethod: () => `'args.method' must be a non-empty string.`,
    invalidRequestParams: () => `'args.params' must be an object or array if provided.`,
    invalidRequestParamsAddress: () => `Invalid parameters: must provide an Ethereum address`,
    invalidSendTransactionRequestParamsMissingTo: () =>
      `Invalid transaction params: must specify 'to' for all other types of transactions. `,
    invalidSendTransactionRequestParamsTo: () => `Invalid 'to' address.`,
    invalidSendTransactionRequestParamsValue: (value) =>
      `Invalid transaction value: '${value}' not a positive number `,
    invalidSignMessageRequestParams: () => `Cannot read properties of undefined (reading '0')`,
    notAuthorized: () => `The requested account and/or method has not been authorized by the user.`,
    permanentlyDisconnected: () =>
      'Blockchain.com: Disconnected from extension background. Page reload required.',
    unsupportedRPCMethod: (method: string) =>
      `Blockchain.com doesn't support this RPC method. ${method}`,
    userRejectedRequest: () => `User rejected request.`
  },
  info: {
    connected: (chainId: string) => `Blockchain.com: Connected to chain with ID "${chainId}".`
  }
}

export enum SupportedRPCMethods {
  RequestAccounts = 'eth_requestAccounts',
  SendRawTransaction = 'eth_sendRawTransaction',
  SendTransaction = 'eth_sendTransaction',
  SignMessage = 'eth_sign',
  SignTransaction = 'eth_signTransaction'
}

export const isTransactionParametersType = (transactionsParameter: any) =>
  !!(transactionsParameter.to && transactionsParameter.value)

export const isValidEthAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address)

export const validateSendTransactionRequestParams = (params) => {
  ;(params as providers.TransactionRequest[]).forEach((param) => {
    if (!isTransactionParametersType(param)) {
      throw serializeError({
        code: -32602,
        message: messages.errors.invalidRequestParamsAddress()
      })
    }

    if (!param.to) {
      throw serializeError({
        code: -32602,
        message: messages.errors.invalidSendTransactionRequestParamsMissingTo()
      })
    }

    if (!isValidEthAddress(param.to)) {
      throw serializeError({
        code: -32602,
        message: messages.errors.invalidSendTransactionRequestParamsTo()
      })
    }

    if (parseInt(String(param.value), 16) < 0) {
      throw serializeError({
        code: -32602,
        message: messages.errors.invalidSendTransactionRequestParamsValue(param.value)
      })
    }
  })
}

export const validateSignMessageRequestParams = (params) => {
  if (!params) {
    throw serializeError({
      code: -32603,
      message: messages.errors.invalidSignMessageRequestParams()
    })
  }

  if (!params[0]) {
    throw serializeError({
      code: -32602,
      message: messages.errors.invalidRequestParamsAddress()
    })
  }
}
