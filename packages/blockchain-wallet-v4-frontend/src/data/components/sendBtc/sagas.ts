import BigNumber from 'bignumber.js'
import bip21 from 'bip21'
import { add, equals, identity, includes, isNil, nth, path, pathOr, prop } from 'ramda'
import { change, destroy, initialize, startSubmit, stopSubmit } from 'redux-form'
import { call, delay, put, race, select, take } from 'redux-saga/effects'

import { Exchange } from '@core'
import { APIType } from '@core/network/api'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import {
  AddressTypesType,
  BtcAccountFromType,
  BtcFromType,
  BtcPaymentType,
  WalletAccountEnum
} from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, actionTypes, selectors } from 'data'
import { Analytics, ModalName } from 'data/types'
import * as C from 'services/alerts'
import { promptForSecondPassword } from 'services/sagas'

import sendSagas from '../send/sagas'
import { emojiRegex } from '../send/types'
import * as A from './actions'
import { FORM } from './model'
import * as S from './selectors'
import { ImportedBtcAddress, ImportedBtcAddressList, SendBtcFormValues } from './types'

const DUST = 546
const DUST_BTC = '0.00000546'
const coin = 'BTC'
const SEND_BTC_FORM = '@SEND.BTC.FORM'

export const logLocation = 'components/sendBtc/sagas'
export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { showWithdrawalLockAlert } = sendSagas({
    api,
    coreSagas,
    networks
  })

  const initialized = function* (action) {
    try {
      const { amount, description, feeType, from, payPro, to } = action.payload
      yield put(A.sendBtcPaymentUpdatedLoading())

      yield put(actions.components.send.fetchPaymentsAccountExchange(coin))
      let payment = coreSagas.payment.btc.create({
        network: networks.btc
      })
      payment = yield payment.init()
      let defaultAccountR

      if (from === 'allImportedAddresses') {
        const addressesR = yield select(selectors.core.common.btc.getActiveAddresses)
        const addresses = addressesR.getOrElse([]).filter(prop('priv')).map(prop('addr'))
        payment = yield payment.from(addresses, ADDRESS_TYPES.LEGACY)
      } else {
        const accountsR = yield select(selectors.core.common.btc.getAccountsBalances)
        const defaultIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
        defaultAccountR = accountsR.map(nth(defaultIndex))
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
      const defaultFeePerByte = payPro
        ? path(['fees', feeType || 'priority'], payment.value())
        : path(['fees', feeType || 'regular'], payment.value())
      payment = yield payment.fee(defaultFeePerByte)
      const prepareTo = (to) => {
        return to ? { value: { label: to, value: to } } : null
      }
      const initialValues = {
        amount,
        coin,
        description,
        feePerByte: defaultFeePerByte,
        from: from || defaultAccountR.getOrElse(),
        payPro,
        to: prepareTo(to)
      }
      if (payPro) {
        try {
          payment = yield payment.build()
        } catch (e) {
          yield put(actions.logs.logErrorMessage(logLocation, 'sendBtcInitialized', e))
        }
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendBtcPaymentUpdatedFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'sendBtcInitialized', e))
    }
  }

  const destroyed = function* () {
    yield put(A.clearSendBtcMaxCustodialWithdrawalFee())
    yield put(actions.form.destroy(FORM))
  }

  const bitPayInvoiceEntered = function* (bip21Payload) {
    yield put(
      actions.modals.showModal(ModalName.CONFIRMATION_MODAL, {
        message: C.BITPAY_CONFIRM_MSG,
        origin: 'SendBtc',
        title: C.BITPAY_CONFIRM_TITLE
      })
    )
    yield put(
      actions.analytics.trackEvent({
        key: Analytics.BITPAY_INVOICE_VALID,
        properties: {
          coin: 'BTC'
        }
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
        origin: 'SendBtc'
      })
    )
  }

  const firstStepSubmitClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      yield put(A.sendBtcPaymentUpdatedLoading())
      let payment: BtcPaymentType = coreSagas.payment.btc.create({
        network: networks.btc,
        payment: p.getOrElse({})
      })
      payment = yield payment.build()
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e))
    }
  }

  const formChanged = function* (action) {
    const formValues: SendBtcFormValues = yield select(selectors.form.getFormValues(SEND_BTC_FORM))
    const maxWithdrawalFee = (yield select(S.getMaxCustodialWithdrawalFee)).getOrElse('')
    const fiatCurrency = (yield select(selectors.core.settings.getCurrency)).getOrElse('USD')
    const fromAccount = formValues?.from
    const amount = formValues?.amount?.coin || '0'

    try {
      const form = path(['meta', 'form'], action)
      if (!equals(FORM, form)) return
      const payload = prop('payload', action)
      const field = path(['meta', 'field'], action)
      const p = yield select(S.getPayment)
      let payment: BtcPaymentType = coreSagas.payment.btc.create({
        network: networks.btc,
        payment: p.getOrElse({})
      })

      const setWithdrawalFee = function* () {
        const withdrawalAmount = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin: 'BTC',
          value: amount
        })
        const response: ReturnType<typeof api.getCustodialToNonCustodialWithdrawalFees> =
          yield call(api.getCustodialToNonCustodialWithdrawalFees, {
            amount: withdrawalAmount,
            currency: 'BTC',
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
        yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
      }

      const setMaxWithdrawalFee = function* () {
        const response: ReturnType<typeof api.getMaxCustodialWithdrawalFee> = yield call(
          api.getMaxCustodialWithdrawalFee,
          {
            currency: 'BTC',
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
        yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
        yield put(A.sendBtcFetchMaxCustodialWithdrawalFeeSuccess(fee))
      }
      switch (field) {
        case 'from':
          const payloadT = payload as BtcFromType
          const fromType = payloadT.type as AddressTypesType
          if (typeof payloadT === 'string') {
            yield payment.from(payloadT, fromType)
            break
          }
          switch (payloadT.type) {
            case 'ACCOUNT':
              payment = yield payment.from(payloadT.index, fromType)
              yield put(change(FORM, 'to', null))
              break
            case 'CUSTODIAL':
              yield call(
                amount === '0' && maxWithdrawalFee === '' ? setMaxWithdrawalFee : setWithdrawalFee
              )

              yield put(change(FORM, 'to', null))
              break
            default:
              payment = yield payment.from(payloadT.address, fromType)
              break
          }
          break
        case 'priv':
          // Payload is the private key entered by the user
          payment = yield payment.from(payload)
          break
        case 'to':
          const value = pathOr(payload, ['value', 'value'], payload) as BtcFromType
          // @ts-ignore
          const toType = prop('type', value)
          // @ts-ignore
          const address = (prop('address', value) || value) as string
          let payProInvoice
          const tryParsePayPro = () => {
            try {
              if (address.indexOf('?') === -1) throw new Error('Not bitpay')
              payProInvoice = bip21.decode(address)
              return payProInvoice
            } catch (e) {
              return null
            }
          }
          switch (true) {
            case equals(toType, ADDRESS_TYPES.ACCOUNT):
              const accountValue = value as BtcAccountFromType
              payment = yield payment.to(accountValue.index, toType)
              // seamless limits logic
              const { from } = yield select(selectors.form.getFormValues(FORM))
              if (toType === ADDRESS_TYPES.ACCOUNT && from.type === ADDRESS_TYPES.CUSTODIAL) {
                const appState = yield select(identity)
                const currency = selectors.core.settings
                  .getCurrency(appState)
                  .getOrFail('Failed to get currency')
                yield put(
                  A.sendBtcFetchLimits(
                    coin,
                    WalletAccountEnum.CUSTODIAL,
                    coin,
                    WalletAccountEnum.NON_CUSTODIAL,
                    currency
                  )
                )
              }
              break
            case (includes('.', address as unknown as string) &&
              !includes('bitpay', address as unknown as string)) ||
              !!address.match(emojiRegex):
              yield put(
                actions.components.send.fetchUnstoppableDomainResults(
                  address as unknown as string,
                  coin
                )
              )
              break
            case !isNil(tryParsePayPro()):
              yield call(bitPayInvoiceEntered, payProInvoice)
              break
            default:
              payment = yield payment.to(address as unknown as string, toType)
          }
          break

        case 'amount':
          const btcAmount = prop('coin', payload)
          const satAmount = Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin,
            value: btcAmount
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
        case 'feePerByte':
          payment = yield payment.fee(parseInt(payload))
          break
        default:
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

  const minimumAmountClicked = function* () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.coins
        .getRates('BTC', appState)
        .getOrFail('Can not retrieve bitcoin rates.')
      const fiat = Exchange.convertCoinToFiat({
        coin,
        currency,
        rates: btcRates,
        value: DUST
      })
      yield put(change(FORM, 'amount', { coin: DUST_BTC, fiat }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'minimumAmountClicked', e))
    }
  }

  const maximumAmountClicked = function* () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.coins
        .getRates('BTC', appState)
        .getOrFail('Can not retrieve bitcoin rates.')
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
        rates: btcRates,
        value: effectiveBalance
      })
      yield put(change(FORM, 'amount', { coin: coinAmount, fiat }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e))
    }
  }

  const minimumFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const minFeePerByte = path(['fees', 'limits', 'min'], payment)
      yield put(change(FORM, 'feePerByte', minFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'minimumFeeClicked', e))
    }
  }

  const maximumFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
      yield put(change(FORM, 'feePerByte', maxFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumFeeClicked', e))
    }
  }

  const regularFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFeePerByte = path(['fees', 'regular'], payment)
      yield put(change(FORM, 'feePerByte', regularFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'regularFeeClicked', e))
    }
  }

  const priorityFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const priorityFeePerByte = path(['fees', 'priority'], payment)
      yield put(change(FORM, 'feePerByte', priorityFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'priorityFeeClicked', e))
    }
  }

  const secondStepSubmitClicked = function* () {
    yield put(startSubmit(FORM))
    const p = yield select(S.getPayment)
    let payment: BtcPaymentType = coreSagas.payment.btc.create({
      network: networks.btc,
      payment: p.getOrElse({})
    })
    const fromType: AddressTypesType | undefined = path(['fromType'], payment.value())
    const { payPro } = yield select(selectors.form.getFormValues(FORM))
    try {
      // Sign payment
      let password
      if (fromType !== ADDRESS_TYPES.WATCH_ONLY) {
        password = yield call(promptForSecondPassword)
      }
      if (fromType !== ADDRESS_TYPES.CUSTODIAL) {
        payment = yield payment.sign(password)
      }
      // Publish payment
      if (payPro) {
        // @ts-ignore
        const { txHex, weightedSize } = payment.value()
        const invoiceId = payPro.paymentUrl.split('/i/')[1]
        yield call(
          // @ts-ignore
          api.verifyPaymentRequest,
          invoiceId,
          txHex,
          weightedSize,
          coin
        )
        yield delay(3000)
        yield call(
          // @ts-ignore
          api.submitPaymentRequest,
          invoiceId,
          txHex,
          weightedSize,
          coin
        )
      } else if (fromType === ADDRESS_TYPES.CUSTODIAL) {
        const value = payment.value()
        if (!value.to) return
        if (!value.amount) return
        if (!value.selection) return

        yield call(
          api.withdrawBSFunds,
          value.to[0].address,
          coin,
          new BigNumber(value.amount[0]).toString(),
          value.selection.fee
        )
      } else {
        const value = payment.value()
        // notify backend of incoming non-custodial deposit
        if (value.to && value.to[0].type === 'CUSTODIAL') {
          yield put(
            actions.components.send.notifyNonCustodialToCustodialTransfer(value, 'SIMPLEBUY')
          )
        }
        payment = yield payment.publish()
      }

      yield put(actions.core.data.btc.fetchData())
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
      // Set tx note
      if (path(['description', 'length'], payment.value())) {
        yield put(
          actions.core.wallet.setTransactionNote(payment.value().txId, payment.value().description)
        )
      }
      // Redirect to tx list, display success
      yield put(actions.router.push('/coins/BTC'))
      yield put(
        actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
          coinName: 'Bitcoin'
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
      const error = errorHandler(e)
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
            coinName: 'Bitcoin'
          })
        )
      }
    }
  }

  const fetchSendLimits = function* ({ payload }: ReturnType<typeof A.sendBtcFetchLimits>) {
    const { currency, fromAccount, inputCurrency, outputCurrency, toAccount } = payload
    try {
      yield put(A.sendBtcFetchLimitsLoading())
      const limitsResponse: ReturnType<typeof api.getCrossBorderTransactions> = yield call(
        api.getCrossBorderTransactions,
        inputCurrency,
        fromAccount,
        outputCurrency,
        toAccount,
        currency
      )
      yield put(A.sendBtcFetchLimitsSuccess(limitsResponse))
    } catch (e) {
      yield put(A.sendBtcFetchLimitsFailure(e))
    }
  }

  const btcImportedFundsSweepEffectiveBalance = function* () {
    try {
      yield take(actionTypes.core.data.btc.FETCH_BTC_DATA_SUCCESS)
      const addressesR = yield select(selectors.core.common.btc.getActiveAddresses)
      const addresses = addressesR.getOrElse([]).filter(prop('priv'))
      const hasEffectiveBalances: ImportedBtcAddressList = []
      // eslint-disable-next-line no-restricted-syntax
      for (const addr of addresses) {
        if (addr.info.final_balance > 0) {
          let payment = coreSagas.payment.btc.create({
            network: networks.btc
          })
          payment = yield payment.init()
          payment = yield payment.from(addr.addr, ADDRESS_TYPES.LEGACY)
          const defaultFeePerByte = path(['fees', 'regular'], payment.value())

          payment = yield payment.fee(defaultFeePerByte)
          const effectiveBalance = prop('effectiveBalance', payment.value())
          if (effectiveBalance > 0) {
            hasEffectiveBalances.push({
              address: addr.addr,
              balance: addr.info.final_balance
            })
          }
        }
      }
      yield put(A.btcImportedFundsSweepEffectiveBalanceSuccess(hasEffectiveBalances))
    } catch (e) {
      yield put(A.btcImportedFundsSweepEffectiveBalanceFailure([]))
    }
  }

  const btcImportedFundsSweep = function* (action) {
    const { payload } = action
    yield put(A.btcImportedFundsSweepLoading())
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const addr of payload) {
        const accounts = (yield select(selectors.core.common.btc.getAccountsBalances)).getOrElse([])
        const defaultIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)

        const defaultAccount = accounts.filter((acc) => acc.index === defaultIndex)[0]

        const receiveIndexMultiaddr = (yield select(
          selectors.core.data.btc.getReceiveIndex(defaultAccount.xpub)
        )).getOrElse(0)
        const receiveIndexPrev = yield select(S.getImportFundsReceiveIndex)

        const receiveIndex = receiveIndexPrev ? receiveIndexPrev + 1 : receiveIndexMultiaddr

        let payment = coreSagas.payment.btc.create({
          network: networks.btc
        })

        payment = yield payment.init()
        payment = yield payment.from(addr, ADDRESS_TYPES.LEGACY)
        payment = yield payment.to(defaultAccount.index, ADDRESS_TYPES.ACCOUNT, receiveIndex)
        const defaultFeePerByte = path(['fees', 'regular'], payment.value())

        payment = yield payment.fee(defaultFeePerByte)
        const effectiveBalance = prop('effectiveBalance', payment.value())
        payment = yield payment.amount(parseInt(effectiveBalance))
        payment = yield payment.build()
        let password
        payment = yield payment.sign(password)
        payment = yield payment.publish()
        yield put(A.setImportFundsReceiveIndex(receiveIndex))
        yield put(
          actions.analytics.trackEvent({
            key: Analytics.TRANSFER_FUNDS_SUCCESS,
            properties: {}
          })
        )
      }
      yield put(actions.core.data.btc.fetchData())
      yield put(A.btcImportedFundsSweepSuccess(true))
    } catch (e) {
      yield put(
        actions.alerts.displayError(C.SEND_COIN_ERROR, {
          coinName: 'Bitcoin'
        })
      )
      yield put(A.btcImportedFundsSweepFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'sweepBtcFunds', e))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.TRANSFER_FUNDS_FAILURE,
          properties: {}
        })
      )
      yield put(A.setImportFundsReceiveIndex(null))
    }
  }
  return {
    bitpayInvoiceExpired,
    btcImportedFundsSweep,
    btcImportedFundsSweepEffectiveBalance,
    destroyed,
    fetchSendLimits,
    firstStepSubmitClicked,
    formChanged,
    initialized,
    maximumAmountClicked,
    maximumFeeClicked,
    minimumAmountClicked,
    minimumFeeClicked,
    priorityFeeClicked,
    regularFeeClicked,
    secondStepSubmitClicked
  }
}
