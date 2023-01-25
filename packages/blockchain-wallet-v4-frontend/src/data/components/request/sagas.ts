import { call, CallEffect, put, PutEffect, SelectEffect } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
import { CoinAccountTypeEnum } from 'data/coins/accountTypes/accountTypes.classes'

import coinSagas from '../../coins/sagas'
import profileSagas from '../../modules/profile/sagas'
import { SwapBaseCounterTypes } from '../swap/types'
import * as A from './actions'
import { RequestExtrasType } from './types'
import { generateKey } from './utils'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  // const logLocation = 'components/request/sagas'
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })
  const { getNextReceiveAddressForCoin } = coinSagas({
    api,
    coreSagas,
    networks
  })

  const getNextAddress = function* (
    action: ReturnType<typeof A.getNextAddress>
  ): Generator<CallEffect | PutEffect | SelectEffect, void, any> {
    const key = generateKey(action.payload.account)
    yield call(waitForUserData)
    try {
      yield put(A.getNextAddressLoading(key))
      let address
      let extras: RequestExtrasType = {}
      const { account } = action.payload

      switch (account.type) {
        case SwapBaseCounterTypes.ACCOUNT:
        case SwapBaseCounterTypes.CUSTODIAL:
          const { accountIndex, coin } = account
          const accountType =
            account.type === SwapBaseCounterTypes.ACCOUNT
              ? CoinAccountTypeEnum.NON_CUSTODIAL
              : CoinAccountTypeEnum.CUSTODIAL
          const response = yield call(getNextReceiveAddressForCoin, coin, accountType, accountIndex)
          address = response.address
          extras = response.extras
          break
        // @ts-ignore
        case 'LEGACY':
          address = account.address
          break
        default:
      }

      yield put(A.getNextAddressSuccess(key, address, extras))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.getNextAddressFailure(key, error))
    }
  }

  return {
    getNextAddress
  }
}
