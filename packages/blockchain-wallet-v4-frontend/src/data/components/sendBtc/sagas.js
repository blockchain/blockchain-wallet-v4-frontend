import { call, select, put } from 'redux-saga/effects'
import { equals, path, prop, nth, is, identity } from 'ramda'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import settings from 'config'

import { initialize, change } from 'redux-form'
import { promptForSecondPassword } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

const DUST = 546
const DUST_BTC = '0.00000546'

export default ({ coreSagas }) => {
  const logLocation = 'components/sendBtc/sagas'

  const sendBtcInitialized = function * (action) {
    try {
      const { to, message, amount, feeType } = action.payload
      yield put(A.sendBtcPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.btc.create(({network: settings.NETWORK_BITCOIN}))
      payment = yield payment.init()
      const accountsR = yield select(selectors.core.common.bitcoin.getAccountsBalances)
      const defaultIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
      const defaultAccountR = accountsR.map(nth(defaultIndex))
      const defaultFeePerByte = path(['fees', feeType || 'regular'], payment.value())
      payment = yield payment.from(defaultIndex)
      payment = yield payment.fee(defaultFeePerByte)
      // TODO :: Redesign account dropdown
      const initialValues = {
        to: to,
        coin: 'BTC',
        amount: amount,
        message: message,
        from: defaultAccountR.getOrElse(),
        feePerByte: defaultFeePerByte
      }
      yield put(initialize('sendBtc', initialValues))
      yield put(A.sendBtcPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'sendBtcInitialized', e))
    }
  }

  const firstStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBtcPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.btc.create({ payment: p.getOrElse({}), network: settings.NETWORK_BITCOIN })
      payment = yield payment.build()
      yield put(A.sendBtcPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e))
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
          if (!prop('watchOnly', payload)) {
            payment = yield payment.from(source)
          }
          break
        case 'priv':
          // Payload is the private key entered by the user
          payment = yield payment.from(payload)
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
      try {
        payment = yield payment.build()
      } catch (e) {
        yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
      }
      yield put(A.sendBtcPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const toToggled = function * () {
    try {
      yield put(change('sendBtc', 'to', ''))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'toToggled', e))
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
      yield put(actions.logs.logErrorMessage(logLocation, 'minimumAmountClicked', e))
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
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e))
    }
  }

  const minimumFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const minFeePerByte = path(['fees', 'limits', 'min'], payment)
      yield put(change('sendBtc', 'feePerByte', minFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'minimumFeeClicked', e))
    }
  }

  const maximumFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
      yield put(change('sendBtc', 'feePerByte', maxFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumFeeClicked', e))
    }
  }

  const regularFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFeePerByte = path(['fees', 'regular'], payment)
      yield put(change('sendBtc', 'feePerByte', regularFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'regularFeeClicked', e))
    }
  }

  const priorityFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const priorityFeePerByte = path(['fees', 'priority'], payment)
      yield put(change('sendBtc', 'feePerByte', priorityFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'priorityFeeClicked', e))
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
      if (path(['description', 'length'], payment.value())) {
        yield put(actions.core.wallet.setTransactionNote(payment.value().txId, payment.value().description))
      }
      yield put(actions.modals.closeAllModals())
      yield put(actions.router.push('/btc/transactions'))
      yield put(actions.alerts.displaySuccess('Your bitcoin has been sent!'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'secondStepSubmitClicked', e))
      yield put(actions.alerts.displayError('Failed to send Bitcoin.'))
    }
  }

  return {
    sendBtcInitialized,
    toToggled,
    minimumAmountClicked,
    maximumAmountClicked,
    minimumFeeClicked,
    maximumFeeClicked,
    regularFeeClicked,
    priorityFeeClicked,
    firstStepSubmitClicked,
    secondStepSubmitClicked,
    formChanged
  }
}
