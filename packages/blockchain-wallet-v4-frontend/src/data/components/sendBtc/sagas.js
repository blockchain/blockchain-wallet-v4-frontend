import { call, select, takeLatest, put } from 'redux-saga/effects'
import { equals, path, prop, nth, is, identity } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import settings from 'config'

import { actionTypes, initialize, change } from 'redux-form'
import { promptForSecondPassword } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

const DUST = 546
const DUST_BTC = '0.00000546'

export default ({ coreSagas }) => {
  const sendBtcInitialized = function * (action, password) {
    try {
      yield put(A.sendBtcPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.btc.create(({network: settings.NETWORK_BITCOIN}))
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
      yield put(A.sendBtcPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      console.log('error: ', e)
    }
  }

  const firstStepSubmitClicked = function * (action) {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBtcPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.btc.create({ payment: p.getOrElse({}), network: settings.NETWORK_BITCOIN })
      payment = yield payment.build()
      yield put(A.sendBtcPaymentUpdated(Remote.of(payment.value())))
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
      let payment = coreSagas.payment.btc.create({ payment: p.getOrElse({}), network: settings.NETWORK_BITCOIN })

      switch (field) {
        case 'coin':
          yield put(actions.modals.closeAllModals())
          switch (payload) {
            case 'ETH': yield put(actions.modals.showModal('SendEther')); break
            case 'BCH': yield put(actions.modals.showModal('SendBch')); break
          }
          break
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
          const btcAmount = prop('coin', payload)
          const satAmount = Exchange.convertBitcoinToBitcoin({ value: btcAmount, fromUnit: 'BTC', toUnit: 'SAT' }).value
          payment = yield payment.amount(parseInt(satAmount))
          break
        case 'description':
          payment = yield payment.description(payload)
          break
        case 'feePerByte':
          payment = yield payment.fee(parseInt(payload))
          break
      }
      try { payment = yield payment.build() } catch (e) {}
      yield put(A.sendBtcPaymentUpdated(Remote.of(payment.value())))
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

  const minimumAmountClicked = function * () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings.getCurrency(appState).getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.bitcoin.getRates(appState).getOrFail('Can not retrieve bitcoin rates.')
      const coin = DUST_BTC
      const fiat = Exchange.convertBitcoinToFiat({ value: DUST, fromUnit: 'SAT', toCurrency: currency, rates: btcRates }).value
      yield put(change('sendBtc', 'amount', { coin, fiat }))
    } catch (e) {
      console.log(e)
    }
  }

  const maximumAmountClicked = function * () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings.getCurrency(appState).getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.bitcoin.getRates(appState).getOrFail('Can not retrieve bitcoin rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertBitcoinToBitcoin({ value: effectiveBalance, fromUnit: 'SAT', toUnit: 'BTC' }).value
      const fiat = Exchange.convertBitcoinToFiat({ value: effectiveBalance, fromUnit: 'SAT', toCurrency: currency, rates: btcRates }).value
      yield put(change('sendBtc', 'amount', { coin, fiat }))
    } catch (e) {
      console.log(e)
    }
  }

  const minimumFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const minFeePerByte = path(['fees', 'limits', 'min'], payment)
      yield put(change('sendBtc', 'feePerByte', minFeePerByte))
    } catch (e) {
      console.log(e)
    }
  }

  const maximumFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
      yield put(change('sendBtc', 'feePerByte', maxFeePerByte))
    } catch (e) {
      console.log(e)
    }
  }

  const regularFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFeePerByte = path(['fees', 'regular'], payment)
      yield put(change('sendBtc', 'feePerByte', regularFeePerByte))
    } catch (e) {
      console.log(e)
    }
  }

  const priorityFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const priorityFeePerByte = path(['fees', 'priority'], payment)
      yield put(change('sendBtc', 'feePerByte', priorityFeePerByte))
    } catch (e) {
      console.log(e)
    }
  }

  const secondStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.btc.create({ payment: p.getOrElse({}), network: settings.NETWORK_BITCOIN })
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
      yield put(A.sendBtcPaymentUpdated(Remote.of(payment.value())))
      if (payment.value().description.length) {
        yield put(actions.core.wallet.setTransactionNote(payment.value().txId, payment.value().description))
      }
      yield put(actions.modals.closeAllModals())
      yield put(actions.router.push('/btc/transactions'))
      yield put(actions.alerts.displaySuccess('Your bitcoin has been sent!'))
    } catch (e) {
      console.log(e)
      yield put(actions.alerts.displayError('Failed to send Bitcoin.'))
    }
  }

  return function * () {
    yield takeLatest(AT.SEND_BTC_INITIALIZED, sendBtcInitialized)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_TO_TOGGLED, toToggled)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_MINIMUM_AMOUNT_CLICKED, minimumAmountClicked)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED, maximumAmountClicked)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_MINIMUM_FEE_CLICKED, minimumFeeClicked)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_MAXIMUM_FEE_CLICKED, maximumFeeClicked)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_REGULAR_FEE_CLICKED, regularFeeClicked)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_PRIORITY_FEE_CLICKED, priorityFeeClicked)
    yield takeLatest(AT.SEND_BTC_FIRST_STEP_SUBMIT_CLICKED, firstStepSubmitClicked)
    yield takeLatest(AT.SEND_BTC_SECOND_STEP_SUBMIT_CLICKED, secondStepSubmitClicked)
    yield takeLatest(actionTypes.CHANGE, formChanged)
  }
}
