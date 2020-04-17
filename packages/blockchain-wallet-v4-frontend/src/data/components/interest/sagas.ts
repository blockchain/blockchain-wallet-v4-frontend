import * as A from './actions'
import { put, select } from 'redux-saga/effects'
import { selectors } from 'data'

import { initialize } from 'redux-form'
import { nth } from 'ramda'

export default () => {
  const initializeInterest = function * ({
    payload
  }: ReturnType<typeof A.initializeInterest>) {
    let defaultAccountR

    switch (payload.coin) {
      case 'BTC':
        const accountsR = yield select(
          selectors.core.common.btc.getAccountsBalances
        )
        const defaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        defaultAccountR = accountsR.map(nth(defaultIndex))
        break
    }

    const initialValues = {
      depositAmount: 0,
      'interest-deposit-select': defaultAccountR.getOrElse()
    }

    yield put(initialize('interestForm', initialValues))
  }

  return { initializeInterest }
}
