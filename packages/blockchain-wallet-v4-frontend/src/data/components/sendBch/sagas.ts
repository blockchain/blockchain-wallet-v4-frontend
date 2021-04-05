import BigNumber from 'bignumber.js'
import bip21 from 'bip21'
import {
  add,
  equals,
  hasPath,
  identity,
  includes,
  isNil,
  nth,
  path,
  pathOr,
  prop
} from 'ramda'
import {
  change,
  destroy,
  initialize,
  startSubmit,
  stopSubmit
} from 'redux-form'
import { call, delay, put, race, select, take } from 'redux-saga/effects'

import { Exchange, utils } from 'blockchain-wallet-v4/src'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import {
  BtcAccountFromType,
  BtcFromType,
  BtcPaymentType
} from 'blockchain-wallet-v4/src/types'
import { actions, actionTypes, model, selectors } from 'data'
import { ModalNamesType } from 'data/modals/types'
import * as C from 'services/alerts'
import * as Lockbox from 'services/lockbox'
import { promptForSecondPassword } from 'services/sagas'

import sendSagas from '../send/sagas'
import * as A from './actions'
import { FORM } from './model'
import * as S from './selectors'

const { TRANSACTION_EVENTS } = model.analytics

export const logLocation = 'components/sendBch/sagas'
export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const { showWithdrawalLockAlert } = sendSagas({
    api,
    coreSagas,
    networks
  })
  const initialized = function * (action) {
    try {
      const { amount, description, from, payPro, to } = action.payload
      yield put(A.sendBchPaymentUpdatedLoading())
      yield put(actions.components.send.fetchPaymentsAccountExchange('BCH'))
      let payment = coreSagas.payment.bch.create({
        network: networks.bch
      })
      payment = yield payment.init()
      const accountsR = yield select(
        selectors.core.common.bch.getAccountsBalances
      )
      const defaultIndexR = yield select(
        selectors.core.kvStore.bch.getDefaultAccountIndex
      )
      const defaultIndex = defaultIndexR.getOrElse(0)
      const defaultAccountR = accountsR.map(nth(defaultIndex))
      if (from === 'allImportedAddresses') {
        const addressesR = yield select(
          selectors.core.common.bch.getActiveAddresses
        )
        const addresses = addressesR
          .getOrElse([])
          .filter(prop('priv'))
          .map(prop('addr'))
          .map(utils.bch.fromCashAddr)
        payment = yield payment.from(addresses, ADDRESS_TYPES.LEGACY)
      } else {
        payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
        if (to) payment = yield payment.to(to)
        if (amount && amount.coin) {
          const satAmount = Exchange.convertBchToBch({
            value: amount.coin,
            fromUnit: 'BCH',
            toUnit: 'SAT'
          }).value
          payment = yield payment.amount(parseInt(satAmount))
        }
        if (description) payment = yield payment.description(description)
      }
      payment = yield payment.fee('regular')
      const initialValues = {
        coin: 'BCH',
        amount,
        description,
        from: from || defaultAccountR.getOrElse(),
        payPro,
        to: to ? { value: { value: to, label: to } } : null
      }
      if (payPro) {
        try {
          payment = yield payment.build()
        } catch (e) {
          yield put(
            actions.logs.logErrorMessage(logLocation, 'sendBchInitialized', e)
          )
        }
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendBchPaymentUpdatedFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'sendBchInitialized', e)
      )
    }
  }

  const destroyed = function * () {
    yield put(actions.form.destroy(FORM))
  }

  const bitPayInvoiceEntered = function * (bip21Payload) {
    yield put(
      actions.modals.showModal('Confirm', {
        origin: 'SendBch',
        title: C.BITPAY_CONFIRM_TITLE,
        message: C.BITPAY_CONFIRM_MSG
      })
    )
    let { canceled } = yield race({
      response: take(actionTypes.wallet.SUBMIT_CONFIRMATION),
      canceled: take(actionTypes.modals.CLOSE_MODAL)
    })
    if (canceled) return
    yield put(actions.modals.closeAllModals())
    yield put(
      actions.goals.saveGoal('paymentProtocol', {
        coin: 'BCH',
        r: pathOr({}, ['options', 'r'], bip21Payload)
      })
    )
    return yield put(actions.goals.runGoals())
  }

  const bitpayInvoiceExpired = function * () {
    yield put(actions.modals.closeAllModals())
    yield put(
      actions.modals.showModal('BitPayInvoiceExpired', { origin: 'SendBch' })
    )
    yield put(
      actions.analytics.logEvent([
        ...TRANSACTION_EVENTS.BITPAY_FAILURE,
        'invoice expired'
      ])
    )
  }

  const firstStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBchPaymentUpdatedLoading())
      let payment = coreSagas.payment.bch.create({
        payment: p.getOrElse({}),
        network: networks.bch
      })
      payment = yield payment.build()
      yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendBchPaymentUpdatedFailure(e))
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
      let p = yield select(S.getPayment)
      let payment: BtcPaymentType = coreSagas.payment.bch.create({
        payment: p.getOrElse({}),
        network: networks.bch
      })

      switch (field) {
        case 'coin':
          const modalName = includes(payload, erc20List) ? 'ETH' : payload
          yield put(actions.modals.closeAllModals())
          yield put(
            actions.modals.showModal(
              `@MODAL.SEND.${modalName}` as ModalNamesType,
              {
                coin: payload,
                origin: 'SendBch'
              }
            )
          )
          break
        case 'from':
          const payloadT = payload as BtcFromType
          const fromType = payloadT.type
          if (typeof payloadT === 'string') {
            yield payment.from(payload, fromType)
            break
          }
          switch (payloadT.type) {
            case 'ACCOUNT':
              payment = yield payment.from(payloadT.index, fromType)
              break
            case 'LOCKBOX':
              payment = yield payment.from(payloadT.xpub, fromType)
              break
            case 'CUSTODIAL':
              payment = yield payment.from(
                payloadT.label,
                fromType,
                payloadT.withdrawable
              )
              yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
              yield put(change(FORM, 'to', null))
              break
            default:
              payment = yield payment.from(payload.address, fromType)
          }
          break
        case 'to':
          const value = pathOr(
            payload,
            ['value', 'value'],
            payload
          ) as BtcFromType
          const toType = prop('type', value)
          // @ts-ignore
          const address = prop('address', value) || value
          let payProInvoice
          const tryParsePayPro = () => {
            try {
              payProInvoice = bip21.decode(address, 'bitcoincash')
              return payProInvoice
            } catch (e) {
              return null
            }
          }
          switch (true) {
            case equals(toType, ADDRESS_TYPES.ACCOUNT):
              const accountValue = value as BtcAccountFromType
              payment = yield payment.to(accountValue.index, toType)
              break
            case equals(toType, ADDRESS_TYPES.LOCKBOX):
              // @ts-ignore
              payment = yield payment.to(value.xpub, toType)
              break
            // ensure 'r' exists, otherwise its just a BCH address in cash addr format
            case !isNil(tryParsePayPro()) &&
              hasPath(['options', 'r'], payProInvoice):
              yield call(bitPayInvoiceEntered, payProInvoice)
              break
            default:
              payment = yield payment.to(address, toType)
          }
          break
        case 'amount':
          const bchAmount = prop('coin', payload)
          const satAmount = Exchange.convertBchToBch({
            value: bchAmount,
            fromUnit: 'BCH',
            toUnit: 'SAT'
          }).value
          payment = yield payment.amount(parseInt(satAmount))
          break
        case 'description':
          payment = yield payment.description(payload)
          break
      }
      try {
        payment = yield payment.build()
      } catch (e) {}
      yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const maximumAmountClicked = function * () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const bchRates = selectors.core.data.bch
        .getRates(appState)
        .getOrFail('Can not retrieve bitcoin cash rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertBchToBch({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toUnit: 'BCH'
      }).value
      const fiat = Exchange.convertBchToFiat({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toCurrency: currency,
        rates: bchRates
      }).value
      yield put(change(FORM, 'amount', { coin, fiat }))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e)
      )
    }
  }

  const secondStepSubmitClicked = function * () {
    yield put(startSubmit(FORM))
    let p = yield select(S.getPayment)
    let payment: BtcPaymentType = coreSagas.payment.bch.create({
      payment: p.getOrElse({}),
      network: networks.bch
    })
    const fromType = path(['fromType'], payment.value())
    try {
      // Sign payment
      if (fromType !== ADDRESS_TYPES.LOCKBOX) {
        let password = yield call(promptForSecondPassword)
        if (fromType !== ADDRESS_TYPES.CUSTODIAL) {
          payment = yield payment.sign(password)
        }
      } else {
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDeviceFromBchXpubs,
          prop('from', p.getOrElse({}))
        )
        const device = deviceR.getOrFail('missing_device')
        const deviceType = prop('device_type', device)
        const selection = payment.value().selection || { outputs: [] }
        const outputs = selection.outputs
          .filter(o => !o.change)
          .map(prop('address'))
        yield call(Lockbox.promptForLockbox, 'BCH', deviceType, outputs)
        let connection = yield select(
          selectors.components.lockbox.getCurrentConnection
        )
        const transport = prop('transport', connection)
        const scrambleKey = Lockbox.utils.getScrambleKey('BCH', deviceType)
        // @ts-ignore
        payment = yield payment.sign(null, transport, scrambleKey)
      }
      // Publish payment
      if (fromType === ADDRESS_TYPES.CUSTODIAL) {
        const value = payment.value()
        if (!value.to) throw new Error('missing_to_from_custodial')
        if (!value.amount) throw new Error('missing_amount_from_custodial')
        yield call(
          api.withdrawSBFunds,
          utils.bch.toCashAddr(value.to[0].address),
          'BCH',
          new BigNumber(value.amount[0]).toString()
        )
      } else {
        payment = yield payment.publish()
      }
      yield put(actions.core.data.bch.fetchData())
      yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
      // Set tx note
      if (path(['description', 'length'], payment.value())) {
        yield put(
          actions.core.kvStore.bch.setTxNotesBch(
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
          selectors.core.kvStore.lockbox.getDeviceFromBchXpubs,
          fromXPubs
        )).getOrFail('missing_device')
        const deviceIndex = prop('device_index', device)
        yield put(actions.router.push(`/lockbox/dashboard/${deviceIndex}`))
      } else {
        yield put(actions.router.push('/bch/transactions'))
        yield put(
          actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
            coinName: 'Bitcoin Cash'
          })
        )
      }

      const amt = payment.value().amount || [0]
      yield put(
        actions.analytics.logEvent([
          ...TRANSACTION_EVENTS.SEND,
          'BCH',
          Exchange.convertCoinToCoin({
            value: amt.reduce(add, 0),
            coin: 'BCH',
            baseToStandard: true
          }).value
        ])
      )
      yield put(actions.modals.closeAllModals())
      yield put(destroy(FORM))
    } catch (e) {
      yield put(stopSubmit(FORM))
      // Set errors
      const error = utils.errorHandler(e)
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
            'BCH',
            e
          ])
        )
        if (fromType === ADDRESS_TYPES.CUSTODIAL && error) {
          if (error === 'Pending withdrawal locks') {
            yield call(showWithdrawalLockAlert)
          } else {
            yield put(actions.alerts.displayError(error))
          }
        } else {
          yield put(
            actions.alerts.displayError(C.SEND_COIN_ERROR, {
              coinName: 'Bitcoin Cash'
            })
          )
        }
      }
    }
  }

  return {
    bitPayInvoiceEntered,
    bitpayInvoiceExpired,
    destroyed,
    firstStepSubmitClicked,
    formChanged,
    initialized,
    maximumAmountClicked,
    secondStepSubmitClicked
  }
}
