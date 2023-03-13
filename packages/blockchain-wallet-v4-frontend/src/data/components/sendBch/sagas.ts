import BigNumber from 'bignumber.js'
import bip21 from 'bip21'
import { add, equals, hasPath, identity, includes, isNil, nth, path, pathOr, prop } from 'ramda'
import { change, destroy, initialize, startSubmit, stopSubmit } from 'redux-form'
import { call, put, race, select, take } from 'redux-saga/effects'

import { Exchange, utils } from '@core'
import { APIType } from '@core/network/api'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { BtcAccountFromType, BtcFromType, BtcPaymentType, WalletAccountEnum } from '@core/types'
import { actions, actionTypes, selectors } from 'data'
import { ModalName } from 'data/types'
import * as C from 'services/alerts'
import { promptForSecondPassword } from 'services/sagas'

import sendSagas from '../send/sagas'
import { emojiRegex } from '../send/types'
import * as A from './actions'
import { FORM } from './model'
import * as S from './selectors'
import { SendBchFormValues } from './types'

const coin = 'BCH'
const SEND_BCH_FORM = '@SEND.BCH.FORM'

export const logLocation = 'components/sendBch/sagas'
export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { showWithdrawalLockAlert } = sendSagas({
    api,
    coreSagas,
    networks
  })
  const initialized = function* (action) {
    try {
      const { amount, description, from, payPro, to } = action.payload
      yield put(A.sendBchPaymentUpdatedLoading())
      yield put(actions.components.send.fetchPaymentsAccountExchange(coin))
      let payment = coreSagas.payment.bch.create({
        network: networks.bch
      })
      payment = yield payment.init()
      const accountsR = yield select(selectors.core.common.bch.getAccountsBalances)
      const defaultIndexR = yield select(selectors.core.kvStore.bch.getDefaultAccountIndex)
      const defaultIndex = defaultIndexR.getOrElse(0)
      const defaultAccountR = accountsR.map(nth(defaultIndex))
      if (from === 'allImportedAddresses') {
        const addressesR = yield select(selectors.core.common.bch.getActiveAddresses)
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
          const satAmount = Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin,
            value: amount.coin
          })
          payment = yield payment.amount(parseInt(satAmount))
        }
        if (description) payment = yield payment.description(description)
      }
      payment = yield payment.fee('regular')
      const initialValues = {
        amount,
        coin,
        description,
        from: from || defaultAccountR.getOrElse(),
        payPro,
        to: to ? { value: { label: to, value: to } } : null
      }
      if (payPro) {
        try {
          payment = yield payment.build()
        } catch (e) {
          yield put(actions.logs.logErrorMessage(logLocation, 'sendBchInitialized', e))
        }
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendBchPaymentUpdatedFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'sendBchInitialized', e))
    }
  }

  const destroyed = function* () {
    yield put(A.clearSendBchMaxCustodialWithdrawalFee())
    yield put(actions.form.destroy(FORM))
  }

  const bitPayInvoiceEntered = function* (bip21Payload) {
    yield put(
      actions.modals.showModal(ModalName.CONFIRMATION_MODAL, {
        message: C.BITPAY_CONFIRM_MSG,
        origin: 'SendBch',
        title: C.BITPAY_CONFIRM_TITLE
      })
    )
    const { canceled } = yield race({
      canceled: take(actions.modals.closeModal.type),
      response: take(actionTypes.wallet.SUBMIT_CONFIRMATION)
    })
    if (canceled) return
    yield put(actions.modals.closeAllModals())
    yield put(
      actions.goals.saveGoal({
        data: {
          coin,
          r: pathOr({}, ['options', 'r'], bip21Payload)
        },
        name: 'paymentProtocol'
      })
    )
    return yield put(actions.goals.runGoals())
  }

  const bitpayInvoiceExpired = function* () {
    yield put(actions.modals.closeAllModals())
    yield put(
      actions.modals.showModal(ModalName.BITPAY_INVOICE_EXPIRED_MODAL, {
        origin: 'SendBch'
      })
    )
  }

  const firstStepSubmitClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      yield put(A.sendBchPaymentUpdatedLoading())
      let payment = coreSagas.payment.bch.create({
        network: networks.bch,
        payment: p.getOrElse({})
      })
      payment = yield payment.build()
      yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendBchPaymentUpdatedFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e))
    }
  }

  const formChanged = function* (action) {
    const formValues: SendBchFormValues = yield select(selectors.form.getFormValues(SEND_BCH_FORM))
    const maxWithdrawalFee = (yield select(S.getMaxCustodialWithdrawalFee)).getOrElse('')
    const fiatCurrency = (yield select(selectors.core.settings.getCurrency)).getOrElse('USD')
    const fromAccount = formValues?.from
    const amount = formValues?.amount?.coin || '0'
    try {
      const form = path(['meta', 'form'], action)
      if (!equals(FORM, form)) return
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      const p = yield select(S.getPayment)
      let payment: BtcPaymentType = coreSagas.payment.bch.create({
        network: networks.bch,
        payment: p.getOrElse({})
      })

      const setWithdrawalFee = function* () {
        const withdrawalAmount = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin: 'BCH',
          value: amount
        })
        const response: ReturnType<typeof api.getCustodialToNonCustodialWithdrawalFees> =
          yield call(api.getCustodialToNonCustodialWithdrawalFees, {
            amount: withdrawalAmount,
            currency: 'BCH',
            fiatCurrency,
            paymentMethod: 'CRYPTO_TRANSFER'
          })

        const fee = response.totalFees.amount.value
        if (fromAccount && fromAccount.type === 'CUSTODIAL') {
          payment = yield payment.from(
            fromAccount.label,
            fromAccount.type,
            new BigNumber(fromAccount.withdrawable).minus(fee).toString()
          )
          payment = yield payment.fee(new BigNumber(fee).toNumber())
        }
        yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
      }

      const setMaxWithdrawalFee = function* () {
        const response: ReturnType<typeof api.getMaxCustodialWithdrawalFee> = yield call(
          api.getMaxCustodialWithdrawalFee,
          {
            currency: 'BCH',
            fiatCurrency,
            paymentMethod: 'CRYPTO_TRANSFER'
          }
        )
        const fee = response.totalFees.amount.value
        if (fromAccount && fromAccount.type === 'CUSTODIAL') {
          payment = yield payment.from(
            fromAccount.label,
            fromAccount.type,
            new BigNumber(fromAccount.withdrawable).minus(fee).toString()
          )
          payment = yield payment.fee(new BigNumber(fee).toNumber())
        }
        yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
        yield put(A.sendBchFetchMaxCustodialWithdrawalFeeSuccess(response.totalFees.amount.value))
      }

      switch (field) {
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
            case 'CUSTODIAL':
              yield call(
                amount === '0' && maxWithdrawalFee === '' ? setMaxWithdrawalFee : setWithdrawalFee
              )
              yield put(change(FORM, 'to', null))
              break
            default:
              payment = yield payment.from(payload.address, fromType)
          }
          break
        case 'to':
          const value = pathOr(payload, ['value', 'value'], payload) as BtcFromType
          const toType = prop('type', value)
          // @ts-ignore
          const address = (prop('address', value) || value) as string
          let payProInvoice
          const tryParsePayPro = () => {
            try {
              if (address.indexOf('?') === -1) throw new Error('Not bitpay')
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
            // ensure 'r' exists, otherwise its just a BCH address in cash addr format
            case includes('.', address as unknown as string) || !!address.match(emojiRegex):
              yield put(
                actions.components.send.fetchUnstoppableDomainResults(
                  address as unknown as string,
                  coin
                )
              )
              break
            case !isNil(tryParsePayPro()) && hasPath(['options', 'r'], payProInvoice):
              yield call(bitPayInvoiceEntered, payProInvoice)
              break
            default:
              payment = yield payment.to(address as unknown as string, toType)
          }
          // seamless limits logic
          const { from } = yield select(selectors.form.getFormValues(FORM))
          if (toType === ADDRESS_TYPES.ACCOUNT && from.type === ADDRESS_TYPES.CUSTODIAL) {
            const appState = yield select(identity)
            const currency = selectors.core.settings
              .getCurrency(appState)
              .getOrFail('Failed to get currency')
            yield put(
              A.sendBchFetchLimits(
                coin,
                WalletAccountEnum.CUSTODIAL,
                coin,
                WalletAccountEnum.NON_CUSTODIAL,
                currency
              )
            )
          }
          break
        case 'amount':
          const bchAmount = prop('coin', payload)
          const satAmount = Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin: 'BCH',
            value: bchAmount
          })
          if (fromAccount?.type === 'CUSTODIAL') {
            yield call(
              new BigNumber(satAmount).isGreaterThan(new BigNumber(fromAccount?.withdrawable))
                ? setMaxWithdrawalFee
                : setWithdrawalFee
            )
          }
          payment = yield payment.amount(parseInt(satAmount))
          break
        case 'description':
          payment = yield payment.description(payload)
          break
        default:
      }
      try {
        payment = yield payment.build()
      } catch (e) {
        yield put(actions.logs.logErrorMessage(logLocation, 'paymentBuild', e))
      }
      yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const maximumAmountClicked = function* () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const bchRates = selectors.core.data.coins
        .getRates('BCH', appState)
        .getOrFail('Can not retrieve bitcoin cash rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coinAmount = Exchange.convertCoinToCoin({
        coin,
        value: effectiveBalance
      })
      const fiat = Exchange.convertCoinToFiat({
        coin,
        currency,
        rates: bchRates,
        value: effectiveBalance
      })
      yield put(change(FORM, 'amount', { coin: coinAmount, fiat }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e))
    }
  }

  const secondStepSubmitClicked = function* () {
    yield put(startSubmit(FORM))
    const p = yield select(S.getPayment)
    let payment: BtcPaymentType = coreSagas.payment.bch.create({
      network: networks.bch,
      payment: p.getOrElse({})
    })
    const fromType = path(['fromType'], payment.value())
    try {
      // Sign payment
      const password = yield call(promptForSecondPassword)
      if (fromType !== ADDRESS_TYPES.CUSTODIAL) {
        payment = yield payment.sign(password)
      }
      // Publish payment
      if (fromType === ADDRESS_TYPES.CUSTODIAL) {
        const value = payment.value()
        if (!value.to) throw new Error('missing_to_from_custodial')
        if (!value.amount) throw new Error('missing_amount_from_custodial')
        if (!value.selection) throw new Error('missing_selection_from_custodial')
        yield call(
          api.withdrawBSFunds,
          utils.bch.isCashAddr(value.to[0].address)
            ? value.to[0].address
            : utils.bch.toCashAddr(value.to[0].address),
          coin,
          new BigNumber(value.amount[0]).toString(),
          value.selection.fee
        )
      } else {
        payment = yield payment.publish()
      }
      yield put(actions.core.data.bch.fetchData())
      yield put(A.sendBchPaymentUpdatedSuccess(payment.value()))
      // Set tx note
      if (path(['description', 'length'], payment.value())) {
        yield put(
          actions.core.kvStore.bch.setTxNotesBch(payment.value().txId, payment.value().description)
        )
      }
      // Redirect to tx list, display success
      yield put(actions.router.push('/coins/BCH'))
      yield put(
        actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
          coinName: 'Bitcoin Cash'
        })
      )

      const amt = payment.value().amount || [0]
      const coinAmount = Exchange.convertCoinToCoin({
        coin,
        value: amt.reduce(add, 0)
      })
      // triggers email notification to user that
      // non-custodial funds were sent from the wallet
      if (fromType === ADDRESS_TYPES.ACCOUNT) {
        yield put(actions.core.wallet.triggerNonCustodialSendAlert(coin, coinAmount))
      }
      yield put(actions.modals.closeAllModals())
      yield put(destroy(FORM))
    } catch (e) {
      yield put(stopSubmit(FORM))
      // Set errors
      const error = utils.errorHandler(e)
      yield put(actions.logs.logErrorMessage(logLocation, 'secondStepSubmitClicked', e))
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

  const fetchSendLimits = function* ({ payload }: ReturnType<typeof A.sendBchFetchLimits>) {
    const { currency, fromAccount, inputCurrency, outputCurrency, toAccount } = payload
    try {
      yield put(A.sendBchFetchLimitsLoading())
      const limitsResponse: ReturnType<typeof api.getCrossBorderTransactions> = yield call(
        api.getCrossBorderTransactions,
        inputCurrency,
        fromAccount,
        outputCurrency,
        toAccount,
        currency
      )
      yield put(A.sendBchFetchLimitsSuccess(limitsResponse))
    } catch (e) {
      yield put(A.sendBchFetchLimitsFailure(e))
    }
  }

  return {
    bitPayInvoiceEntered,
    bitpayInvoiceExpired,
    destroyed,
    fetchSendLimits,
    firstStepSubmitClicked,
    formChanged,
    initialized,
    maximumAmountClicked,
    secondStepSubmitClicked
  }
}
