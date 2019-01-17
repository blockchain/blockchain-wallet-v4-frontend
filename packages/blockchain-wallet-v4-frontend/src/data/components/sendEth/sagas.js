import { call, select, put, take } from 'redux-saga/effects'
import { equals, identity, path, prop, head } from 'ramda'
import { delay } from 'redux-saga'
import * as A from './actions'
import * as S from './selectors'
import { FORM } from './model'
import { actions, actionTypes, selectors, model } from 'data'
import {
  initialize,
  change,
  startSubmit,
  stopSubmit,
  destroy
} from 'redux-form'
import * as C from 'services/AlertService'
import * as Lockbox from 'services/LockboxService'
import { promptForSecondPassword, promptForLockbox } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

export const logLocation = 'components/sendEth/sagas'

export default ({ coreSagas, networks }) => {
  const initialized = function*(action) {
    try {
      const from = path(['payload', 'from'], action)
      const type = path(['payload', 'type'], action)
      yield put(A.sendEthPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.eth.create({
        network: networks.eth
      })
      payment = yield payment.init()
      payment =
        from && type ? yield payment.from(from, type) : yield payment.from()
      const defaultFee = path(['fees', 'regular'], payment.value())
      const ethAccountR = yield select(
        selectors.core.common.eth.getAccountBalances
      )
      const defaultAccountR = ethAccountR.map(head)
      const initialValues = {
        coin: 'ETH',
        fee: defaultFee,
        from: defaultAccountR.getOrElse({})
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'sendEthInitialized', e)
      )
    }
  }

  const destroyed = function*() {
    yield put(actions.form.destroy(FORM))
  }

  const firstStepSubmitClicked = function*() {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendEthPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.eth.create({
        payment: p.getOrElse({}),
        network: networks.eth
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
      if (!equals(FORM, form)) return
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.eth.create({
        payment: p.getOrElse({}),
        network: networks.eth
      })

      switch (field) {
        case 'coin':
          switch (payload) {
            case 'BTC': {
              yield put(actions.modals.closeAllModals())
              yield put(
                actions.modals.showModal(model.components.sendBtc.MODAL)
              )
              break
            }
            case 'BCH': {
              yield put(actions.modals.closeAllModals())
              yield put(
                actions.modals.showModal(model.components.sendBch.MODAL)
              )
              break
            }
            case 'XLM': {
              yield put(actions.modals.closeAllModals())
              yield put(
                actions.modals.showModal(model.components.sendXlm.MODAL)
              )
              break
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
          const account = path(['from', 'address'], payment.value())
          payment = yield payment.fee(parseInt(payload), account)
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
      yield put(change(FORM, 'amount', { coin, fiat }))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e)
      )
    }
  }

  const secondStepSubmitClicked = function*() {
    yield put(startSubmit(FORM))
    let p = yield select(S.getPayment)
    let payment = coreSagas.payment.eth.create({
      payment: p.getOrElse({}),
      network: networks.eth
    })
    const fromType = path(['from', 'type'], payment.value())
    const toAddress = path(['to', 'address'], payment.value())
    const fromAddress = path(['from', 'address'], payment.value())
    try {
      // Sign payment
      if (fromType !== ADDRESS_TYPES.LOCKBOX) {
        let password = yield call(promptForSecondPassword)
        payment = yield payment.sign(password)
      } else {
        const device = (yield select(
          selectors.core.kvStore.lockbox.getDeviceFromEthAddr,
          fromAddress
        )).getOrFail('missing_device')
        const deviceType = prop('device_type', device)
        yield call(promptForLockbox, 'ETH', deviceType, [toAddress])
        let connection = yield select(
          selectors.components.lockbox.getCurrentConnection
        )
        const transport = prop('transport', connection)
        const scrambleKey = Lockbox.utils.getScrambleKey('ETH', deviceType)
        payment = yield payment.sign(null, transport, scrambleKey)
      }
      // Publish payment
      payment = yield payment.publish()
      yield put(A.sendEthPaymentUpdated(Remote.of(payment.value())))
      // Update metadata
      if (fromType === ADDRESS_TYPES.LOCKBOX) {
        const device = (yield select(
          selectors.core.kvStore.lockbox.getDeviceFromEthAddr,
          fromAddress
        )).getOrFail('missing_device')
        const deviceIndex = prop('device_index', device)
        yield put(
          actions.core.kvStore.lockbox.setLatestTxTimestampEth(
            deviceIndex,
            Date.now()
          )
        )
        yield take(
          actionTypes.core.kvStore.lockbox.FETCH_METADATA_LOCKBOX_SUCCESS
        )
        yield put(
          actions.core.kvStore.lockbox.setLatestTxEth(
            deviceIndex,
            payment.value().txId
          )
        )
      } else {
        yield put(
          actions.core.kvStore.ethereum.setLatestTxTimestampEthereum(Date.now())
        )
        yield take(
          actionTypes.core.kvStore.ethereum.FETCH_METADATA_ETHEREUM_SUCCESS
        )
        yield put(
          actions.core.kvStore.ethereum.setLatestTxEthereum(
            payment.value().txId
          )
        )
      }
      if (path(['description', 'length'], payment.value())) {
        if (fromType !== ADDRESS_TYPES.LOCKBOX) {
          yield take(
            actionTypes.core.kvStore.ethereum.FETCH_METADATA_ETHEREUM_SUCCESS
          )
        }
        yield put(
          actions.core.kvStore.ethereum.setTxNotesEthereum(
            payment.value().txId,
            payment.value().description
          )
        )
      }
      // Display success
      if (fromType === ADDRESS_TYPES.LOCKBOX) {
        yield put(actions.components.lockbox.setConnectionSuccess())
        yield delay(4000)
        const device = (yield select(
          selectors.core.kvStore.lockbox.getDeviceFromEthAddr,
          fromAddress
        )).getOrFail('missing_device')
        const deviceIndex = prop('device_index', device)
        yield put(actions.router.push(`/lockbox/dashboard/${deviceIndex}`))
      } else {
        yield put(actions.router.push('/eth/transactions'))
        yield put(actions.alerts.displaySuccess(C.SEND_ETH_SUCCESS))
      }
      yield put(destroy(FORM))
      // Close modals
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(stopSubmit(FORM))
      // Set errors
      if (fromType === ADDRESS_TYPES.LOCKBOX) {
        yield put(actions.components.lockbox.setConnectionError(e))
      } else {
        yield put(
          actions.logs.logErrorMessage(
            logLocation,
            'secondStepSubmitClicked',
            e
          )
        )
        yield put(actions.alerts.displayError(C.SEND_ETH_ERROR))
      }
    }
  }

  const regularFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFee = path(['fees', 'regular'], payment)
      yield put(change(FORM, 'fee', regularFee))
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
      yield put(change(FORM, 'fee', priorityFee))
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
      yield put(change(FORM, 'fee', minFee))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'minimumFeeClicked', e)
      )
    }
  }

  const toToggled = function*() {
    try {
      yield put(change(FORM, 'to', ''))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'toToggled', e))
    }
  }

  const maximumFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFee = path(['fees', 'limits', 'max'], payment)
      yield put(change(FORM, 'fee', maxFee))
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
    priorityFeeClicked,
    toToggled
  }
}
