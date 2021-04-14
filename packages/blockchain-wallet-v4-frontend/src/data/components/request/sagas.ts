import { call, CallEffect, put, PutEffect } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'

import coinSagas from '../../coins/sagas'
import profileSagas from '../../modules/profile/sagas'
import * as A from './actions'
import { generateKey } from './utils'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  // const logLocation = 'components/request/sagas'
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })
  const { getNextReceiveAddressForCoin } = coinSagas({
    coreSagas,
    networks
  })

  const getNextAddress = function * (
    action: ReturnType<typeof A.getNextAddress>
  ): Generator<CallEffect | PutEffect, void, any> {
    const key = generateKey(action.payload.account)
    try {
      yield put(A.getNextAddressLoading(key))
      let address
      if (action.payload.account.type === 'CUSTODIAL') {
        waitForUserData()
        const custodial: ReturnType<typeof api.getSBPaymentAccount> = yield call(
          api.getSBPaymentAccount,
          action.payload.account.coin
        )
        address = custodial.address
      }

      if (action.payload.account.type === 'ACCOUNT') {
        const { accountIndex, coin } = action.payload.account
        address = yield call(getNextReceiveAddressForCoin, coin, accountIndex)
      }

      yield put(A.getNextAddressSuccess(key, address))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.getNextAddressFailure(key, error))
    }
  }

  return {
    getNextAddress
  }
}
