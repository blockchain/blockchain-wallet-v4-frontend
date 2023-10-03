import { call, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { CoinType } from '@core/types'
import { sha256 } from '@core/walletCrypto'
import { selectors } from 'data'

// retrieves the next receive address
export const getNextReceiveAddress = function* (coin: CoinType, networks, index, api: APIType) {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)

  const guidHash = sha256(guid).toString('hex')
  const sharedKeyHash = sha256(sharedKey).toString('hex')
  const { results }: ReturnType<typeof api.getAddresses> = yield call(api.getAddresses, {
    auth: { guidHash, sharedKeyHash },
    currencies: [
      {
        ticker: coin
      }
    ]
  })

  const address = results[0].addresses.find(({ default: isDefault }) => isDefault)
  console.log({ address, results })

  return address?.address
}
