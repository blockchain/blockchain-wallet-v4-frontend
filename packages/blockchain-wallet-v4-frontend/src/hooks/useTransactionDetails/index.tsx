// import { sha256 } from '@core/walletCrypto'
import { useState } from 'react'

import { sha256 } from '@core/walletCrypto'

const useTransactionDetails = ({ guid, sharedKey, txId }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [txDetails, setData] = useState<any>([])
  const apiUrl = 'https://api.staging.blockchain.info/wallet-pubkey/activityDetail'
  const [loading, setLoading] = useState(false)

  const guidHash = sha256(guid).toString('hex')
  const sharedKeyHash = sha256(sharedKey).toString('hex')

  const fetchTxDetails = async () => {
    setLoading(true)
    const result = await fetch(apiUrl, {
      body: JSON.stringify({
        auth: {
          guidHash,
          sharedKeyHash
        },
        localisation: {
          // TODO: get i10n locale
          fiatCurrency: 'EUR',
          locales: 'en-GB;q=1.0, en',
          timeZone: 'Europe/London'
        },
        network: 'MATIC.MATIC',
        pubKey: '0220a92c91de19b5bd1aae04442f843d87f3d0021d751cf51eebb5704016a07dc4',
        txId
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const responseData = await result.json()

    const txDetailsGrouped = [
      ...responseData.itemGroups[0].itemGroup,
      ...responseData.itemGroups[1].itemGroup
    ]

    const reorderedItems = [
      [txDetailsGrouped[1], txDetailsGrouped[6], null],
      [txDetailsGrouped[2], txDetailsGrouped[4], txDetailsGrouped[3]]
    ]

    setData(reorderedItems)
    setLoading(false)
  }

  return { fetchTxDetails, loading, txDetails }
}

export default useTransactionDetails
