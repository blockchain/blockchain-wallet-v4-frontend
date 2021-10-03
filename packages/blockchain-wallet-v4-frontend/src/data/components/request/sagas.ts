import { call, CallEffect, put, PutEffect, SelectEffect } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'

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
    coreSagas,
    networks
  })

  const getNextAddress = function* (
    action: ReturnType<typeof A.getNextAddress>
  ): Generator<CallEffect | PutEffect | SelectEffect, void, any> {
    const key = generateKey(action.payload.account)
    try {
      yield put(A.getNextAddressLoading(key))
      let address
      const extras: RequestExtrasType = {}
      const { account } = action.payload

      switch (account.type) {
        case SwapBaseCounterTypes.ACCOUNT:
          const { accountIndex, coin } = account
          address = yield call(getNextReceiveAddressForCoin, coin, accountIndex)
          break
        case SwapBaseCounterTypes.CUSTODIAL:
          yield call(waitForUserData)
          const custodial: ReturnType<typeof api.getSBPaymentAccount> = yield call(
            // @ts-ignore
            api.getSBPaymentAccount,
            account.coin
          )
          address = custodial.address
          if (window.coins[account.coin].coinfig.type.isMemoBased) {
            // eslint-disable-next-line prefer-destructuring
            extras.Memo = address.split(':')[1]
            // eslint-disable-next-line prefer-destructuring
            address = address.split(':')[0]
          }
          break
        // SwapAccountType only supports ACCOUNT and CUSTODIAL?
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
