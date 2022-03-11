import { call } from 'ramda'
import { select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { CoinType } from '@core/types'
import { selectors } from 'data'
import { promptForSecondPassword } from 'services/sagas'

// retrieves the next receive address
export const getNextReceiveAddress = function* (coin: CoinType, networks, index, api: APIType) {
  const password = yield call(promptForSecondPassword)
  const mnemonic = selectors.core.wallet.getMnemonic(yield select(), password)

  return '0x12345678910'
}
