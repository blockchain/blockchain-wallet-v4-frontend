import { call, select, put } from 'redux-saga/effects'
import { equals, identity, path, prop } from 'ramda'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import settings from 'config'

import { initialize, change } from 'redux-form'
import { promptForSecondPassword } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const logLocation = 'components/sendEth/sagas'

  const sendEthInitialized = function * (action) {
    try {
      yield put(A.sendEthPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.eth.create(({ network: settings.NETWORK_ETHEREUM }))
      payment = yield payment.init()
      payment = yield payment.from(action.payload.from, action.payload.type)
      const initialValues = { coin: 'ETH' }
      yield put(initialize('sendEth', initialValues))
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
      yield
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'sendEthInitialized', e))
    }
  }

  const firstStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendEthPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.eth.create({ payment: p.getOrElse({}), network: settings.NETWORK_ETHEREUM })
      payment = yield payment.build()
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e))
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
        case 'coin':
          yield put(actions.modals.closeAllModals())
          switch (payload) {
            case 'BTC': yield put(actions.modals.showModal('SendBitcoin')); break
            case 'BCH': yield put(actions.modals.showModal('SendBch')); break
          }
          break
        case 'to':
          payment = yield payment.to(payload)
          break
        case 'amount':
          const ethAmount = prop('coin', payload)
          const weiAmount = Exchange.convertEtherToEther({ value: ethAmount, fromUnit: 'ETH', toUnit: 'WEI' }).value
          payment = yield payment.amount(weiAmount)
          break
        case 'message':
          payment = yield payment.description(payload)
          break
      }
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const maximumAmountClicked = function * () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings.getCurrency(appState).getOrFail('Can not retrieve currency.')
      const ethRates = selectors.core.data.ethereum.getRates(appState).getOrFail('Can not retrieve ethereum rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertEtherToEther({ value: effectiveBalance, fromUnit: 'WEI', toUnit: 'ETH' }).value
      const fiat = Exchange.convertEtherToFiat({ value: effectiveBalance, fromUnit: 'WEI', toCurrency: currency, rates: ethRates }).value
      yield put(change('sendEth', 'amount', { coin, fiat }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e))
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
      yield put(actions.logs.logErrorMessage(logLocation, 'secondStepSubmitClicked', e))
      yield put(actions.alerts.displayError('Failed to send Ether.'))
    }
  }

  return {
    sendEthInitialized,
    firstStepSubmitClicked,
    maximumAmountClicked,
    secondStepSubmitClicked,
    formChanged
  }
}
