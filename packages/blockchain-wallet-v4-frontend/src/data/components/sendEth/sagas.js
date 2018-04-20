import { call, select, takeLatest, put } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import settings from 'config'

import { actionTypes, initialize } from 'redux-form'
import { promptForSecondPassword } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const sendEthInitialized = function * (action, password) {
    try {
      yield put(A.sendEthPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.eth.create(({ network: settings.NETWORK_ETHEREUM }))
      payment = yield payment.init()
      payment = yield payment.from()
      const initialValues = { coin: 'ETH' }
      yield put(initialize('sendEth', initialValues))
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
      yield
    } catch (e) {
      console.log('error: ', e)
    }
  }

  const firstStepSubmitClicked = function * (action) {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendEthPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.eth.create({ payment: p.getOrElse({}), network: settings.NETWORK_ETHEREUM })
      payment = yield payment.build()
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      console.log(e)
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('sendEth', form)) return
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.eth.create({ payment: p.getOrElse({}), network: settings.NETWORK_ETHEREUM })

      switch (field) {
        case 'to':
          payment = yield payment.to(payload)
          break
        case 'amount':
          const wei = Exchange.convertEtherToEther({ value: payload, fromUnit: 'ETH', toUnit: 'WEI' }).value
          payment = yield payment.amount(wei)
          break
        case 'message':
          payment = yield payment.description(payload)
          break
      }
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      console.log(e)
    }
  }

  const secondStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.eth.create({ payment: p.getOrElse({}), network: settings.NETWORK_ETHEREUM })
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
      yield put(actions.modals.closeAllModals())
      yield put(actions.router.push('/eth/transactions'))
      yield put(actions.alerts.displaySuccess('Ether transaction has been successfully published!'))
    } catch (e) {
      console.log(e)
      yield put(actions.alerts.displayError('Bitcoin transaction could not be published.'))
    }
  }

  return function * () {
    yield takeLatest(AT.SEND_ETH_INITIALIZED, sendEthInitialized)
    yield takeLatest(AT.SEND_ETH_FIRST_STEP_SUBMIT_CLICKED, firstStepSubmitClicked)
    yield takeLatest(AT.SEND_ETH_SECOND_STEP_SUBMIT_CLICKED, secondStepSubmitClicked)
    yield takeLatest(actionTypes.CHANGE, formChanged)
  }
}
