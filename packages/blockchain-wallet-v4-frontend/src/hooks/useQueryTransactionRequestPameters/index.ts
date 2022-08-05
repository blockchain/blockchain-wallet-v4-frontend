import { useEffect, useState } from 'react'
import { Transaction } from 'plugin/internal/transactions'

export const useQueryTransactionRequestPameters = (path: string) => {
  const [transactionRequestParameters, setTransactionRequestParameters] =
    useState<null | Transaction>(null)

  useEffect(() => {
    ;(async () => {
      const params = new URLSearchParams(path)

      setTransactionRequestParameters(
        new Transaction(
          params.get('to') || '',
          params.get('from') || '',
          params.get('nonce') || '',
          params.get('gasLimit') || 0,
          params.get('gasPrice') || '',
          params.get('data') || '',
          params.get('value') || 0,
          Number(params.get('chainId')) || 0
        )
      )
    })()
  }, [path])

  return transactionRequestParameters
}
