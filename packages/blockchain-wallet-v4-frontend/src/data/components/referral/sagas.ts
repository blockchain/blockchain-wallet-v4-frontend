import { isEmpty } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
import profileSagas from 'data/modules/profile/sagas'

import * as selectors from '../../selectors'
import { actions as A } from './slice'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  const getReferralInformation = function* () {
    yield call(waitForUserData)
    const currencyR = yield select(selectors.core.settings.getCurrency)
    const currency = currencyR.getOrElse('USD')
    try {
      const referralInformation = yield call(api.getReferralInformation, currency)
      if (!isEmpty(referralInformation)) {
        yield put(A.setReferralInformation(referralInformation))
      }
    } catch (e) {
      console.error('Referral is not available', errorHandler(e))
    }
  }

  return {
    getReferralInformation
  }
}
