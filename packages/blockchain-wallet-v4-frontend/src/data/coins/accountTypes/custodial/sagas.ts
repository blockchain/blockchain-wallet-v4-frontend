import { call } from 'typed-redux-saga'

import { CoinType } from '@core/types'
import { getApi } from 'data/utils/sagas/getApi'

export const getNextReceiveAddress = function* (coin: CoinType) {
  const api = yield* getApi()
  const custodial = yield* call(api.getBSPaymentAccount, coin)
  const { address } = custodial

  if (window.coins[coin].coinfig.type.isMemoBased && address.split(':')[1]) {
    return {
      address: address.split(':')[0],
      extras: { Memo: address.split(':')[1] }
    }
  }

  return { address: custodial, extras: {} }
}
