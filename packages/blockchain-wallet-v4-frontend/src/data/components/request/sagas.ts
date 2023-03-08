import { call, CallEffect, put, PutEffect, select, SelectEffect } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
import { actions } from 'data'
import { AccountType } from 'data/coins/accountTypes/accountTypes'

import coinSagas from '../../coins/sagas'
import profileSagas from '../../modules/profile/sagas'
import { SwapBaseCounterTypes } from '../swap/types'
import * as A from './actions'
import * as S from './selectors'
import { RequestExtrasType } from './types'
import { generateKey } from './utils'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  // const logLocation = 'components/request/sagas'
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })
  const { getNextReceiveAddressForCoin } = coinSagas({
    coreSagas
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
      const { coinfig } = window.coins[account.coin]

      const subscriptions = S.getSubscriptions(yield select())
      const isSubscribed = subscriptions.data.currencies.some((c) => c.ticker === account.baseCoin)
      if (!isSubscribed) {
        yield put(actions.core.data.coins.subscribe(account.baseCoin))
      }
      switch (account.type) {
        case SwapBaseCounterTypes.ACCOUNT:
        case SwapBaseCounterTypes.CUSTODIAL:
          const { accountIndex, coin } = account
          const accountType =
            account.type === SwapBaseCounterTypes.ACCOUNT
              ? coinfig.products.includes('DynamicSelfCustody')
                ? AccountType.DYNAMIC_SELF_CUSTODY
                : coinfig.type.name === 'ERC20'
                ? AccountType.ERC20
                : AccountType.NON_CUSTODIAL
              : AccountType.CUSTODIAL
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
