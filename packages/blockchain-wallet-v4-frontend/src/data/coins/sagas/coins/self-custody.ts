import { call } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { getPubKey } from '@core/redux/data/self-custody/sagas'
import { CoinType } from '@core/types'
import { promptForSecondPassword } from 'services/sagas'

// retrieves the next receive address
export const getNextReceiveAddress = function* (coin: CoinType, networks, index, api: APIType) {
  const password = yield call(promptForSecondPassword)
  const pubKeys = yield call(getPubKey, password)
  const { results }: ReturnType<typeof api.deriveAddress> = yield call(
    api.deriveAddress,
    coin,
    pubKeys
  )
  const address = results.find(({ default: isDefault }) => isDefault)
  return address?.address
}
