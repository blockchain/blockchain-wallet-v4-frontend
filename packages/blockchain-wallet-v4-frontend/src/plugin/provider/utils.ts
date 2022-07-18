export const messages = {
  errors: {
    invalidRequestArgs: () => `Expected a single, non-array, object argument.`,
    invalidRequestMethod: () => `'args.method' must be a non-empty string.`,
    invalidRequestParams: () => `'args.params' must be an object or array if provided.`,
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

export const supportedRPCMethods = [
  'eth_requestAccounts',
  'eth_sign',
  'eth_signTypedData',
  'eth_sendTransaction',
  'eth_signTransaction',
  'eth_sendRawTransaction'
]
