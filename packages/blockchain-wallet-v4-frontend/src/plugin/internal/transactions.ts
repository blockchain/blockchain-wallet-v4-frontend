import { BigNumberish, BytesLike, providers, utils } from 'ethers'

export class Transaction implements providers.TransactionRequest {
  /* eslint-disable no-useless-constructor */
  constructor(
    public to: string = '',
    public from: string = '',
    public nonce: BigNumberish = '',
    public gasLimit: BigNumberish = '',
    public gasPrice: BigNumberish = '',
    public data: BytesLike = '',
    public value: BigNumberish = '',
    public chainId: number = 0
  ) {}
}

export const transactionRequestToQueryParameters = (
  transactionRequest: providers.TransactionRequest
) => {
  const transactionRequestEntries = Object.entries(transactionRequest)
  const queryParams = transactionRequestEntries
    .map(
      (parameter: [string, any]) =>
        `${parameter[0]}=${
          parameter[1]._isBigNumber ? utils.formatEther(parameter[1]) : parameter[1]
        }`
    )
    .join('&')

  return queryParams
}
