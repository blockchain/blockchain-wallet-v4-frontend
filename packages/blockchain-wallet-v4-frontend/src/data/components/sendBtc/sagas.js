import { call, select, takeLatest, put } from 'redux-saga/effects'
import { equals, path, prop, nth, is } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import settings from 'config'

import { actionTypes, initialize, change } from 'redux-form'
import { promptForSecondPassword } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const sendBtcInitialized = function * (action, password) {
    try {
      yield put(A.sendBtcFirstStepPaymentUpdated(Remote.Loading))
      let payment = coreSagas.data.bitcoin.createPayment({network: settings.NETWORK_BITCOIN})
      payment = yield payment.init()
      const accountsR = yield select(selectors.core.common.bitcoin.getAccountsBalances)
      const defaultIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
      const defaultAccountR = accountsR.map(nth(defaultIndex))
      const defaultFeePerByte = path(['fees', 'regular'], payment.value())
      payment = yield payment.from(defaultIndex)
      payment = yield payment.fee(defaultFeePerByte)
      // TODO :: Redesign account dropdown
      const initialValues = {
        coin: 'BTC',
        from: defaultAccountR.getOrElse(),
        feePerByte: defaultFeePerByte
      }
      yield put(initialize('sendBtc', initialValues))
      yield put(A.sendBtcFirstStepPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      console.log('error: ', e)
    }
  }

  const firstStepSubmitClicked = function * (action) {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBtcFirstStepPaymentUpdated(Remote.Loading))
      let payment = coreSagas.data.bitcoin.createPayment({ payment: p.getOrElse({}), network: settings.NETWORK_BITCOIN })
      payment = yield payment.build()
      yield put(A.sendBtcFirstStepPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      console.log(e)
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('sendBtc', form)) return

      let p = yield select(S.getPayment)
      let payment = coreSagas.data.bitcoin.createPayment({ payment: p.getOrElse({}), network: settings.NETWORK_BITCOIN })

      switch (field) {
        case 'from':
          const source = prop('address', payload) || prop('index', payload)
          payment = yield payment.from(source)
          break
        case 'to':
          const target = is(String, payload)
            ? payload
            : prop('address', payload) || prop('index', payload)
          payment = yield payment.to(target)
          break
        case 'amount':
          const satoshis = Exchange.convertBitcoinToBitcoin({ value: payload, fromUnit: 'BTC', toUnit: 'SAT' }).value
          payment = yield payment.amount(parseInt(satoshis))
          break
        case 'message':
          payment = yield payment.description(payload)
          break
        case 'feePerByte':
          payment = yield payment.fee(parseInt(payload))
          break
      }
      yield put(A.sendBtcFirstStepPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      console.log(e)
    }
  }

  const toToggled = function * () {
    try {
      yield put(change('sendBtc', 'to', ''))
    } catch (e) {
      console.log(e)
    }
  }

  const secondStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      let payment = coreSagas.data.bitcoin.createPayment({ payment: p.getOrElse({}), network: settings.NETWORK_BITCOIN })
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
      yield put(actions.modals.closeAllModals())
      yield put(actions.router.push('/btc/transactions'))
      yield put(actions.alerts.displaySuccess('Bitcoin transaction has been successfully published!'))
    } catch (e) {
      console.log(e)
      yield put(actions.alerts.displayError('Bitcoin transaction could not be published.'))
    }
  }

  return function * () {
    yield takeLatest(AT.SEND_BTC_INITIALIZED, sendBtcInitialized)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_TO_TOGGLED, toToggled)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_SUBMIT_CLICKED, firstStepSubmitClicked)
    yield takeLatest(AT.SEND_BTC_SECOND_STEP_SUBMIT_CLICKED, secondStepSubmitClicked)
    yield takeLatest(actionTypes.CHANGE, formChanged)
  }
}
