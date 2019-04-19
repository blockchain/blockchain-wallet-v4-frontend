import { call, select, put, take } from 'redux-saga/effects'
import {
  equals,
  identity,
  includes,
  path,
  prop,
  propOr,
  head,
  toLower
} from 'ramda'
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
import { Exchange } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

const { TRANSACTION_EVENTS } = model.analytics

export const logLocation = 'components/sendEth/sagas'
export default ({ coreSagas, networks }) => {
  const initialized = function * (action) {
    try {
      const erc20List = (yield select(
        selectors.core.walletOptions.getErc20CoinList
      )).getOrFail()
      const coin = propOr('ETH', 'payload', action)
      const isErc20 = includes(coin, erc20List)
      let initialValues = {}
      yield put(A.sendEthPaymentUpdatedLoading())
      let payment = coreSagas.payment.eth.create({
        network: networks.eth
      })
      payment = yield payment.init({ isErc20, coin })
      payment = yield payment.from(coin)
      const defaultFee = path(['fees', 'regular'], payment.value())
      if (isErc20) {
        const erc20AccountR = yield select(
          selectors.core.common.eth.getErc20AccountBalances,
          coin
        )
        initialValues = {
          coin,
          fee: defaultFee,
          from: erc20AccountR.getOrElse({})
        }
      } else {
        const ethAccountR = yield select(
          selectors.core.common.eth.getAccountBalances
        )
        const defaultAccountR = ethAccountR.map(head)
        initialValues = {
          coin,
          fee: defaultFee,
          from: defaultAccountR.getOrElse({})
        }
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'sendEthInitialized', e)
      )
    }
  }

  const destroyed = function * () {
    yield put(actions.form.destroy(FORM))
  }

  const firstStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendEthPaymentUpdatedLoading())
      let payment = coreSagas.payment.eth.create({
        payment: p.getOrElse({}),
        network: networks.eth
      })
      payment = yield payment.build()
      yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendEthPaymentUpdatedFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e)
      )
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      if (!equals(FORM, form)) return
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      const erc20List = (yield select(
        selectors.core.walletOptions.getErc20CoinList
      )).getOrElse([])
      const { coin } = yield select(selectors.form.getFormValues(FORM))
      const isErc20 = includes(coin, erc20List)
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.eth.create({
        payment: p.getOrElse({}),
        network: networks.eth
      })

      switch (field) {
        case 'coin':
          const modalName = isErc20 ? 'ETH' : payload
          yield put(actions.modals.closeAllModals())
          yield put(
            actions.modals.showModal(`@MODAL.SEND.${modalName}`, {
              coin: payload
            })
          )
          break
        case 'from':
          const coin = prop('coin', payload)
          const source = prop('address', payload)
          const fromType = prop('type', payload)
          payment = yield payment.from(coin, source, fromType)
          break
        case 'to':
          payment = yield payment.to(payload.value.value)
          break
        case 'amount':
          const coinCode = prop('coinCode', payload)
          const weiAmount = Exchange.convertCoinToCoin({
            value: prop('coin', payload),
            coin: coinCode
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

      yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const maximumAmountClicked = function * (action) {
    try {
      const coinCode = prop('coin', action.payload)
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Failed to get currency')
      let rates, fiat
      if (equals(coinCode, 'ETH')) {
        rates = selectors.core.data.eth
          .getRates(appState)
          .getOrFail('Failed to get ETH rates')
      } else {
        rates = (yield select(
          selectors.core.data.eth.getErc20Rates,
          toLower(coinCode)
        )).getOrFail(`Failed to get ${coinCode} rates`)
      }
      const payment = (yield select(S.getPayment)).getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertCoinToCoin({
        value: effectiveBalance,
        coin: coinCode,
        baseToStandard: true
      }).value
      fiat = Exchange.convertCoinUnitToFiat({
        coin: coinCode,
        value: effectiveBalance,
        fromUnit: 'WEI',
        toCurrency: currency,
        rates: rates
      }).value
      yield put(change(FORM, 'amount', { coin, fiat }))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e)
      )
    }
  }

  const secondStepSubmitClicked = function * () {
    const { coin } = yield select(selectors.form.getFormValues(FORM))
    const coinModel = (yield select(
      selectors.core.walletOptions.getCoinModel,
      coin
    )).getOrFail()
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
        payment = yield payment.sign(password, null, null)
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
      yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
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
        yield put(actions.core.kvStore.eth.setLatestTxTimestampEth(Date.now()))
        yield take(actionTypes.core.kvStore.eth.FETCH_METADATA_ETH_SUCCESS)
        yield put(actions.core.kvStore.eth.setLatestTxEth(payment.value().txId))
      }
      // Notes
      if (path(['description', 'length'], payment.value())) {
        if (fromType !== ADDRESS_TYPES.LOCKBOX) {
          yield take(actionTypes.core.kvStore.eth.FETCH_METADATA_ETH_SUCCESS)
        }
        if (coinModel.contractAddress) {
          yield put(
            actions.core.kvStore.eth.setTxNotesErc20(
              coin,
              payment.value().txId,
              payment.value().description
            )
          )
        } else {
          yield put(
            actions.core.kvStore.eth.setTxNotesEth(
              payment.value().txId,
              payment.value().description
            )
          )
        }
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
        yield put(actions.router.push(coinModel.txListAppRoute))
        yield put(
          actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
            coinName: coinModel.displayName
          })
        )
      }
      yield put(
        actions.analytics.logEvent([
          ...TRANSACTION_EVENTS.SEND,
          coin,
          Exchange.convertCoinToCoin({
            value: payment.value().amount,
            coin,
            baseToStandard: true
          }).value
        ])
      )
      yield put(destroy(FORM))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(stopSubmit(FORM))
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
        yield put(
          actions.analytics.logEvent([
            ...TRANSACTION_EVENTS.SEND_FAILURE,
            'ETH',
            e
          ])
        )
        yield put(
          actions.alerts.displayError(C.SEND_COIN_ERROR, {
            coinName: coinModel.displayName
          })
        )
      }
    }
  }

  const regularFeeClicked = function * () {
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

  const priorityFeeClicked = function * () {
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

  const minimumFeeClicked = function * () {
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

  const toToggled = function * () {
    try {
      yield put(change(FORM, 'to', ''))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'toToggled', e))
    }
  }

  const maximumFeeClicked = function * () {
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
