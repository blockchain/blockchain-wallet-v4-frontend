import { providers, utils } from 'ethers'

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
