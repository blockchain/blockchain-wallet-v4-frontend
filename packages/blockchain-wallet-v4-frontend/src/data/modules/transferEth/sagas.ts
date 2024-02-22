import { call, put, select } from 'redux-saga/effects'

import { EthPaymentType } from '@core/types'
import { actions } from 'data'
import * as C from 'services/alerts'
import { promptForSecondPassword } from 'services/sagas'

import * as S from './selectors'
import { actions as A } from './transferEthSlice'

export const logLocation = 'modules/transferEth/sagas'

export default ({ coreSagas, networks }) => {
  const transferEthInitialized = function* ({
    payload
  }: ReturnType<typeof A.transferEthInitialized>) {
    try {
      yield put(A.transferEthPaymentUpdatedLoading())
      let payment: EthPaymentType = coreSagas.payment.eth.create({ network: networks.eth })
      payment = yield payment.init({ coin: 'ETH' })
      payment = yield payment.from(payload.from, payload.type)
      yield put(A.transferEthPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'transferEthInitialized', e))
    }
  }

  const confirmTransferEth = function* (action: ReturnType<typeof A.confirmTransferEth>) {
    try {
      yield put(actions.form.startSubmit('transferEth'))
      const { effectiveBalance, to } = action.payload
      const p = S.getPayment(yield select())
      let payment: EthPaymentType = coreSagas.payment.eth.create({
        network: networks.eth,
        payment: p.getOrElse({})
      })
      payment = yield payment.to(to)
      const password = yield call(promptForSecondPassword)
      payment = yield payment.amount(effectiveBalance)
      payment = yield payment.build()
      payment = yield payment.signLegacy(password)
      yield payment.publish()
      yield put(actions.modals.closeAllModals())
      yield put(actions.router.push('/coins/ETH'))
      yield put(actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, { coinName: 'Ethereum' }))
      yield put(actions.form.stopSubmit('transferEth'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'confirmTransferEth', e))
      yield put(actions.alerts.displayError(C.SEND_COIN_ERROR, { coinName: 'Ethereum' }))
      yield put(actions.form.stopSubmit('transferEth'))
    }
  }

  return {
    confirmTransferEth,
    transferEthInitialized
  }
}
