import { call, select, put, take } from 'redux-saga/effects'
import { equals, identity, path, prop } from 'ramda'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors from '../../selectors'
import settings from 'config'
import { initialize, change } from 'redux-form'
import * as C from 'services/AlertService'
import { promptForSecondPassword, promptForLockbox } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

export const logLocation = 'components/sendEth/sagas'

export default ({ coreSagas }) => {
  const initialized = function*(action) {
    try {
      const from = path(['payload', 'from'], action)
      const type = path(['payload', 'type'], action)
      yield put(A.sendEthPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.eth.create({
        network: settings.NETWORK_ETH
      })
      payment = yield payment.init()
      payment =
        from && type
          ? yield payment.from(action.payload.from, action.payload.type)
          : yield payment.from()
      const defaultFee = path(['fees', 'regular'], payment.value())
      const initialValues = { coin: 'ETH', fee: defaultFee }
      yield put(initialize('sendEth', initialValues))
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'sendEthInitialized', e)
      )
    }
  }

  const destroyed = function*() {
    yield put(actions.form.destroy('sendEth'))
  }

  const firstStepSubmitClicked = function*() {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendEthPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.eth.create({
        payment: p.getOrElse({}),
        network: settings.NETWORK_ETH
      })
      payment = yield payment.build()
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e)
      )
    }
  }

  const formChanged = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('sendEth', form)) return
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.eth.create({
        payment: p.getOrElse({}),
        network: settings.NETWORK_ETH
      })

      switch (field) {
        case 'coin':
          switch (payload) {
            case 'BTC': {
              yield put(actions.modals.closeAllModals())
              yield put(actions.modals.showModal('SendBitcoin'))
              break
            }
            case 'BCH': {
              yield put(actions.modals.closeAllModals())
              yield put(actions.modals.showModal('SendBch'))
            }
          }
          break
        case 'from':
          const source = prop('address', payload)
          const fromType = prop('type', payload)
          payment = yield payment.from(source, fromType)
          break
        case 'to':
          payment = yield payment.to(payload)
          break
        case 'amount':
          const ethAmount = prop('coin', payload)
          const weiAmount = Exchange.convertEtherToEther({
            value: ethAmount,
            fromUnit: 'ETH',
            toUnit: 'WEI'
          }).value
          payment = yield payment.amount(weiAmount)
          break
        case 'description':
          payment = yield payment.description(payload)
          break
        case 'fee':
          payment = yield payment.fee(parseInt(payload))
          break
      }

      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const maximumAmountClicked = function*() {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const ethRates = selectors.core.data.ethereum
        .getRates(appState)
        .getOrFail('Can not retrieve ethereum rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertEtherToEther({
        value: effectiveBalance,
        fromUnit: 'WEI',
        toUnit: 'ETH'
      }).value
      const fiat = Exchange.convertEtherToFiat({
        value: effectiveBalance,
        fromUnit: 'WEI',
        toCurrency: currency,
        rates: ethRates
      }).value
      yield put(change('sendEth', 'amount', { coin, fiat }))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e)
      )
    }
  }

  const secondStepSubmitClicked = function*() {
    try {
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.eth.create({
        payment: p.getOrElse({}),
        network: settings.NETWORK_ETH
      })
      if (p.getOrElse({}).from.type !== ADDRESS_TYPES.LOCKBOX) {
        let password = yield call(promptForSecondPassword)
        payment = yield payment.sign(password)
      } else {
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDeviceFromEthAddr,
          path(['from', 'address'], p.getOrElse({}))
        )
        const device = deviceR.getOrFail('missing_device')
        yield call(promptForLockbox, 'ETH', prop('device_id', device))
        let connection = yield select(
          selectors.components.lockbox.getCurrentConnection
        )
        let transport = prop('transport', connection)
        payment = yield payment.sign(null, transport)
      }
      payment = yield payment.publish()
      yield put(actions.modals.closeAllModals())
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
      yield put(
        actions.core.kvStore.ethereum.setLatestTxTimestampEthereum(Date.now())
      )
      yield take(
        actionTypes.core.kvStore.ethereum.FETCH_METADATA_ETHEREUM_SUCCESS
      )
      yield put(
        actions.core.kvStore.ethereum.setLatestTxEthereum(payment.value().txId)
      )
      yield put(actions.alerts.displaySuccess(C.SEND_ETH_SUCCESS))
      if (path(['description', 'length'], payment.value())) {
        yield take(
          actionTypes.core.kvStore.ethereum.FETCH_METADATA_ETHEREUM_SUCCESS
        )
        yield put(
          actions.core.kvStore.ethereum.setTxNotesEthereum(
            payment.value().txId,
            payment.value().description
          )
        )
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'secondStepSubmitClicked', e)
      )
      yield put(actions.alerts.displayError(C.SEND_ETH_ERROR))
    }
  }

  const regularFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFee = path(['fees', 'regular'], payment)
      yield put(change('sendEth', 'fee', regularFee))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'regularFeeClicked', e)
      )
    }
  }

  const priorityFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const priorityFee = path(['fees', 'priority'], payment)
      yield put(change('sendEth', 'fee', priorityFee))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'priorityFeeClicked', e)
      )
    }
  }

  const minimumFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const minFee = path(['fees', 'limits', 'min'], payment)
      yield put(change('sendEth', 'fee', minFee))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'minimumFeeClicked', e)
      )
    }
  }

  const maximumFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFee = path(['fees', 'limits', 'max'], payment)
      yield put(change('sendEth', 'fee', maxFee))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumFeeClicked', e)
      )
    }
  }

  return {
    initialized,
    destroyed,
    firstStepSubmitClicked,
    maximumAmountClicked,
    maximumFeeClicked,
    minimumFeeClicked,
    secondStepSubmitClicked,
    formChanged,
    regularFeeClicked,
    priorityFeeClicked
  }
}
