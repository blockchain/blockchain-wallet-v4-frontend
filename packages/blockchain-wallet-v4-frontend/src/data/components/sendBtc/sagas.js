import { equals, path, pathOr, prop, nth, is, identity, includes } from 'ramda'
import { call, delay, put, select } from 'redux-saga/effects'
import * as A from './actions'
import * as S from './selectors'
import { FORM } from './model'
import { actions, model, selectors } from 'data'
import {
  initialize,
  change,
  startSubmit,
  stopSubmit,
  destroy
} from 'redux-form'
import * as C from 'services/AlertService'
import { promptForSecondPassword, promptForLockbox } from 'services/SagaService'
import * as Lockbox from 'services/LockboxService'
import { Exchange } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

const DUST = 546
const DUST_BTC = '0.00000546'
const { TRANSACTION_EVENTS } = model.analytics
export const logLocation = 'components/sendBtc/sagas'
export default ({ coreSagas, networks }) => {
  const initialized = function * (action) {
    try {
      const {
        from,
        to,
        amount,
        feeType,
        description,
        lockboxIndex
      } = action.payload
      yield put(A.sendBtcPaymentUpdatedLoading())
      let payment = coreSagas.payment.btc.create({
        network: networks.btc
      })
      payment = yield payment.init()
      let defaultAccountR
      if (lockboxIndex && lockboxIndex >= 0) {
        const accountsR = yield select(
          selectors.core.common.btc.getLockboxBtcBalances
        )
        defaultAccountR = accountsR.map(nth(lockboxIndex))
        const xpub = defaultAccountR.map(prop('xpub')).getOrFail()
        payment = yield payment.from(xpub, ADDRESS_TYPES.LOCKBOX)
      } else if (from === 'allImportedAddresses') {
        const addressesR = yield select(
          selectors.core.common.btc.getActiveAddresses
        )
        const addresses = addressesR
          .getOrElse([])
          .filter(prop('priv'))
          .map(prop('addr'))
        payment = yield payment.from(addresses, ADDRESS_TYPES.LEGACY)
      } else {
        const accountsR = yield select(
          selectors.core.common.btc.getAccountsBalances
        )
        const defaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        defaultAccountR = accountsR.map(nth(defaultIndex))
        payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
        if (to) payment = yield payment.to(to)
      }
      const defaultFeePerByte = path(
        ['fees', feeType || 'regular'],
        payment.value()
      )
      payment = yield payment.fee(defaultFeePerByte)
      const prepareTo = to => {
        return to ? { value: { value: to, label: to } } : null
      }
      const initialValues = {
        coin: 'BTC',
        amount,
        description,
        to: prepareTo(to),
        from: from || defaultAccountR.getOrElse(),
        feePerByte: defaultFeePerByte
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendBtcPaymentUpdatedFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'sendBtcInitialized', e)
      )
    }
  }

  const destroyed = function * () {
    yield put(actions.form.destroy(FORM))
  }

  const firstStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBtcPaymentUpdatedLoading())
      let payment = coreSagas.payment.btc.create({
        payment: p.getOrElse({}),
        network: networks.btc
      })
      payment = yield payment.build()
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
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
      )).getOrFail()
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.btc.create({
        payment: p.getOrElse({}),
        network: networks.btc
      })

      switch (field) {
        case 'coin':
          const modalName = includes(payload, erc20List) ? 'ETH' : payload
          yield put(actions.modals.closeAllModals())
          yield put(
            actions.modals.showModal(`@MODAL.SEND.${modalName}`, {
              coin: payload
            })
          )
          break
        case 'from':
          const fromType = prop('type', payload)
          if (is(String, payload)) {
            yield payment.from(payload, fromType)
            break
          }
          switch (fromType) {
            case ADDRESS_TYPES.ACCOUNT:
              payment = yield payment.from(payload.index, fromType)
              break
            case ADDRESS_TYPES.LOCKBOX:
              payment = yield payment.from(payload.xpub, fromType)
              break
            default:
              if (!payload.watchOnly) {
                payment = yield payment.from(payload.address, fromType)
              }
          }
          break
        case 'priv':
          // Payload is the private key entered by the user
          payment = yield payment.from(payload)
          break
        case 'to':
          const value = pathOr({}, ['value', 'value'], payload)
          const toType = prop('type', value)
          switch (toType) {
            case ADDRESS_TYPES.ACCOUNT:
              payment = yield payment.to(value.index, toType)
              break
            case ADDRESS_TYPES.LOCKBOX:
              payment = yield payment.to(value.xpub, toType)
              break
            default:
              const address = prop('address', value) || value
              payment = yield payment.to(address, toType)
          }
          break
        case 'amount':
          const btcAmount = prop('coin', payload)
          const satAmount = Exchange.convertBtcToBtc({
            value: btcAmount,
            fromUnit: 'BTC',
            toUnit: 'SAT'
          }).value
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
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const minimumAmountClicked = function * () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.btc
        .getRates(appState)
        .getOrFail('Can not retrieve bitcoin rates.')
      const coin = DUST_BTC
      const fiat = Exchange.convertBtcToFiat({
        value: DUST,
        fromUnit: 'SAT',
        toCurrency: currency,
        rates: btcRates
      }).value
      yield put(change(FORM, 'amount', { coin, fiat }))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'minimumAmountClicked', e)
      )
    }
  }

  const maximumAmountClicked = function * () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.btc
        .getRates(appState)
        .getOrFail('Can not retrieve bitcoin rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertBtcToBtc({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toUnit: 'BTC'
      }).value
      const fiat = Exchange.convertBtcToFiat({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toCurrency: currency,
        rates: btcRates
      }).value
      yield put(change(FORM, 'amount', { coin, fiat }))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e)
      )
    }
  }

  const minimumFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const minFeePerByte = path(['fees', 'limits', 'min'], payment)
      yield put(change(FORM, 'feePerByte', minFeePerByte))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'minimumFeeClicked', e)
      )
    }
  }

  const maximumFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
      yield put(change(FORM, 'feePerByte', maxFeePerByte))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumFeeClicked', e)
      )
    }
  }

  const regularFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFeePerByte = path(['fees', 'regular'], payment)
      yield put(change(FORM, 'feePerByte', regularFeePerByte))
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
      const priorityFeePerByte = path(['fees', 'priority'], payment)
      yield put(change(FORM, 'feePerByte', priorityFeePerByte))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'priorityFeeClicked', e)
      )
    }
  }

  const secondStepSubmitClicked = function * () {
    yield put(startSubmit(FORM))
    let p = yield select(S.getPayment)
    let payment = coreSagas.payment.btc.create({
      payment: p.getOrElse({}),
      network: networks.btc
    })
    const fromType = path(['fromType'], payment.value())
    try {
      // Sign payment
      let password
      if (fromType !== ADDRESS_TYPES.LOCKBOX) {
        if (fromType !== ADDRESS_TYPES.WATCH_ONLY) {
          password = yield call(promptForSecondPassword)
        }
        payment = yield payment.sign(password)
      } else {
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDeviceFromBtcXpubs,
          prop('from', p.getOrElse({}))
        )
        const device = deviceR.getOrFail('missing_device')
        const deviceType = prop('device_type', device)
        const outputs = path(['selection', 'outputs'], payment.value())
          .filter(o => !o.change)
          .map(prop('address'))
        yield call(promptForLockbox, 'BTC', deviceType, outputs)
        let connection = yield select(
          selectors.components.lockbox.getCurrentConnection
        )
        const transport = prop('transport', connection)
        const scrambleKey = Lockbox.utils.getScrambleKey('BTC', deviceType)
        payment = yield payment.sign(null, transport, scrambleKey)
      }
      // Publish payment
      payment = yield payment.publish()
      yield put(actions.core.data.btc.fetchData())
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
      // Set tx note
      if (path(['description', 'length'], payment.value())) {
        yield put(
          actions.core.wallet.setTransactionNote(
            payment.value().txId,
            payment.value().description
          )
        )
      }
      // Redirect to tx list, display success
      if (fromType === ADDRESS_TYPES.LOCKBOX) {
        yield put(actions.components.lockbox.setConnectionSuccess())
        yield delay(4000)
        const fromXPubs = path(['from'], payment.value())
        const device = (yield select(
          selectors.core.kvStore.lockbox.getDeviceFromBtcXpubs,
          fromXPubs
        )).getOrFail('missing_device')
        const deviceIndex = prop('device_index', device)
        yield put(actions.router.push(`/lockbox/dashboard/${deviceIndex}`))
      } else {
        yield put(actions.router.push('/btc/transactions'))
        yield put(
          actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
            coinName: 'Bitcoin'
          })
        )
      }
      yield put(
        actions.analytics.logEvent([
          ...TRANSACTION_EVENTS.SEND,
          'BTC',
          Exchange.convertCoinToCoin({
            value: payment.value().amount,
            coin: 'BTC',
            baseToStandard: true
          }).value
        ])
      )
      yield put(actions.modals.closeAllModals())
      yield put(destroy(FORM))
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
        yield put(
          actions.analytics.logEvent([
            ...TRANSACTION_EVENTS.SEND_FAILURE,
            'BTC',
            e
          ])
        )
        yield put(
          actions.alerts.displayError(C.SEND_COIN_ERROR, {
            coinName: 'Bitcoin'
          })
        )
      }
    }
  }

  return {
    initialized,
    destroyed,
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
