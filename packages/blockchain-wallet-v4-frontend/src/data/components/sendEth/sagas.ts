import BigNumber from 'bignumber.js'
import * as ethers from 'ethers'
import { equals, head, identity, includes, path, pathOr, prop, propOr } from 'ramda'
import { change, destroy, initialize, startSubmit, stopSubmit } from 'redux-form'
import { call, delay, put, select, take } from 'redux-saga/effects'

import { Exchange } from '@core'
import { APIType } from '@core/network/api'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { EthAccountFromType } from '@core/redux/payment/eth/types'
import { Erc20CoinType, EthPaymentType, WalletAccountEnum } from '@core/types'
import { errorHandler } from '@core/utils'
import { calculateFee } from '@core/utils/eth'
import { actions, actionTypes, selectors } from 'data'
import * as C from 'services/alerts'
import * as Lockbox from 'services/lockbox'
import { promptForSecondPassword } from 'services/sagas'

import sendSagas from '../send/sagas'
import { emojiRegex } from '../send/types'
import * as A from './actions'
import * as AT from './actionTypes'
import { FORM } from './model'
import * as S from './selectors'
import {
  SendEthFormActionType,
  SendEthFormAmountActionType,
  SendEthFormDescActionType,
  SendEthFormFeeActionType,
  SendEthFormFromActionType,
  SendEthFormToActionType
} from './types'

const ETH = 'ETH'
export const logLocation = 'components/sendEth/sagas'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas; networks }) => {
  const { showWithdrawalLockAlert } = sendSagas({
    api,
    coreSagas,
    networks
  })
  const initialized = function* (action) {
    try {
      const coin: string = propOr(ETH, 'payload', action)
      const { coinfig } = window.coins[coin]
      const isErc20 = coinfig.type.erc20Address
      let initialValues = {}
      yield put(A.sendEthPaymentUpdatedLoading())
      yield put(actions.components.send.fetchPaymentsAccountExchange(coin))
      let payment = coreSagas.payment.eth.create({
        network: networks.eth
      })
      payment = yield payment.init({ coin, isErc20 })
      payment = yield payment.from()
      const defaultFee = path(['fees', 'regular'], payment.value())
      if (isErc20) {
        const erc20AccountR = yield select(selectors.core.common.eth.getErc20AccountBalances, coin)
        const defaultErc20AccountR = erc20AccountR.map(head)
        initialValues = {
          coin,
          fee: defaultFee,
          from: defaultErc20AccountR.getOrElse({})
        }
      } else {
        const ethAccountR = yield select(selectors.core.common.eth.getAccountBalances)
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
      yield put(actions.logs.logErrorMessage(logLocation, 'sendEthInitialized', e))
    }
  }

  const destroyed = function* () {
    yield put(actions.form.destroy(FORM))
  }

  const firstStepSubmitClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      yield put(A.sendEthPaymentUpdatedLoading())
      let payment = coreSagas.payment.eth.create({
        network: networks.eth,
        payment: p.getOrElse({})
      })
      payment = yield payment.build()
      yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendEthPaymentUpdatedFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e))
    }
  }

  const formChanged = function* (action: SendEthFormActionType) {
    try {
      const { form } = action.meta
      if (!equals(FORM, form)) return
      const { payload } = action
      const { coin } = yield select(selectors.form.getFormValues(FORM))
      const p = yield select(S.getPayment)
      let payment: EthPaymentType = coreSagas.payment.eth.create({
        network: networks.eth,
        payment: p.getOrElse({})
      })

      switch (action.meta.field) {
        case 'from':
          const fromPayload = payload as SendEthFormFromActionType['payload']
          let source
          switch (fromPayload.type) {
            case 'LOCKBOX':
            case 'ACCOUNT':
              source = fromPayload.address
              payment = yield payment.from(source, fromPayload.type)
              break
            case 'CUSTODIAL':
              const response: ReturnType<typeof api.getWithdrawalFees> = yield call(
                api.getWithdrawalFees,
                'simplebuy',
                'DEFAULT'
              )
              const fee = response.fees.find(({ symbol }) => symbol === coin)?.minorValue || '0'
              source = fromPayload.label
              payment = yield payment.from(
                source,
                fromPayload.type,
                new BigNumber(fromPayload.withdrawable).minus(fee).toString()
              )
              payment = yield payment.fee(new BigNumber(fee).toNumber(), '', coin)
              yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
              yield put(change(FORM, 'to', null))
              break
            default:
          }
          break
        case 'to':
          const toPayload = payload as SendEthFormToActionType['payload']
          const value = pathOr(toPayload, ['value', 'value'], toPayload)

          if (
            typeof value !== 'object' &&
            (includes('.', value as unknown as string) ||
              (value as unknown as string).match(emojiRegex))
          ) {
            yield put(
              actions.components.send.fetchUnstoppableDomainResults(
                value as unknown as string,
                coin
              )
            )
            return
          }
          // @ts-ignore
          payment = yield payment.to(value)
          // Do not block payment update when to is changed w/ isContract check
          yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
          // After updating payment success check if to isContract

          if (payment.value().from.type === ADDRESS_TYPES.CUSTODIAL) {
            // @ts-ignore
            payment = yield payment.setIsContract(false)
            yield put(A.sendEthCheckIsContractSuccess(false))
            // seamless limits logic
            if (payment.value()?.to?.type || payment.value()?.to?.type === ADDRESS_TYPES.ADDRESS) {
              const appState = yield select(identity)
              const currency = selectors.core.settings
                .getCurrency(appState)
                .getOrFail('Failed to get currency')
              yield put(
                A.sendEthFetchLimits(
                  coin,
                  WalletAccountEnum.CUSTODIAL,
                  coin,
                  WalletAccountEnum.NON_CUSTODIAL,
                  currency
                )
              )
            }
            return
          }
          yield put(A.sendEthCheckIsContract(value))

          return
        case 'amount':
          const amountPayload = payload as SendEthFormAmountActionType['payload']
          const coinCode = prop('coinCode', amountPayload)
          const weiAmount = Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin: coinCode,
            value: amountPayload.coin
          })
          payment = yield payment.amount(weiAmount)
          break
        case 'description':
          const descPayload = payload as SendEthFormDescActionType['payload']
          payment = yield payment.description(descPayload)
          break
        case 'fee':
          const feePayload = payload as SendEthFormFeeActionType['payload']
          const account = path(['from', 'address'], payment.value())
          // @ts-ignore
          payment = yield payment.fee(feePayload, account)
          break
        default:
      }

      yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const maximumAmountClicked = function* (action) {
    try {
      const coinCode = action.payload
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Failed to get currency')
      const rates = selectors.core.data.coins
        .getRates(coinCode, appState)
        .getOrFail(`Failed to get ${coinCode} rates`)
      const payment = (yield select(S.getPayment)).getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertCoinToCoin({
        coin: coinCode,
        value: effectiveBalance
      })
      const fiat = Exchange.convertCoinToFiat({
        coin: coinCode,
        currency,
        rates,
        value: effectiveBalance
      })
      yield put(change(FORM, 'amount', { coin, coinCode, fiat }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e))
    }
  }

  const secondStepSubmitClicked = function* () {
    const { coin } = yield select(selectors.form.getFormValues(FORM))
    const { coinfig } = window.coins[coin]
    yield put(startSubmit(FORM))
    const p = yield select(S.getPayment)
    let payment: EthPaymentType = coreSagas.payment.eth.create({
      network: networks.eth,
      payment: p.getOrElse({})
    })
    const fromType = payment.value().from.type
    const toAddress = path(['to', 'address'], payment.value())
    const fromAddress = path(['from', 'address'], payment.value())
    const { isRetryAttempt } = payment.value()

    try {
      // Sign payment
      if (fromType !== 'LOCKBOX') {
        const password = yield call(promptForSecondPassword)
        if (fromType !== 'CUSTODIAL') {
          // @ts-ignore
          payment = yield payment.sign(password, null, null)
        }
      } else if (fromType === 'LOCKBOX') {
        const device = (yield select(
          selectors.core.kvStore.lockbox.getDeviceFromEthAddr,
          fromAddress
        )).getOrFail('missing_device')
        const deviceType = prop('device_type', device)
        yield call(Lockbox.promptForLockbox, ETH, deviceType, [toAddress])
        const connection = yield select(selectors.components.lockbox.getCurrentConnection)
        const transport = prop('transport', connection)
        const scrambleKey = Lockbox.utils.getScrambleKey(ETH, deviceType)
        // @ts-ignore
        payment = yield payment.sign(null, transport, scrambleKey)
      }
      // Publish payment
      if (fromType === 'CUSTODIAL') {
        const value = payment.value()
        if (!value.to) throw new Error('missing_to_from_custodial')
        if (!value.amount) throw new Error('missing_amount_from_custodial')
        yield call(api.withdrawBSFunds, value.to.address, coin, value.amount)
      } else {
        payment = yield payment.publish()
      }
      yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
      // Update metadata
      if (fromType === ADDRESS_TYPES.LOCKBOX) {
        const device = (yield select(
          selectors.core.kvStore.lockbox.getDeviceFromEthAddr,
          fromAddress
        )).getOrFail('missing_device')
        const deviceIndex = prop('device_index', device)
        yield put(
          actions.core.kvStore.lockbox.setLatestTxTimestampEthLockbox(deviceIndex, Date.now())
        )
        yield take(actionTypes.core.kvStore.lockbox.FETCH_METADATA_LOCKBOX_SUCCESS)
        yield put(
          actions.core.kvStore.lockbox.setLatestTxEthLockbox(deviceIndex, payment.value().txId)
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
        if (coinfig.type.erc20Address) {
          yield put(
            actions.core.kvStore.eth.setTxNotesErc20(
              coin,
              payment.value().txId,
              payment.value().description
            )
          )
        }
        yield put(
          actions.core.kvStore.eth.setTxNotesEth(payment.value().txId, payment.value().description)
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
        yield put(actions.router.push(`/${coin}/transactions`))
        if (coin === ETH) {
          yield put(actions.core.data.eth.fetchTransactions(null, true))
        } else {
          yield put(actions.core.data.eth.fetchErc20Transactions(coin, true))
        }
        yield put(
          actions.alerts.displaySuccess(
            isRetryAttempt ? C.RESEND_COIN_SUCCESS : C.SEND_COIN_SUCCESS,
            {
              coinName: coinfig.name
            }
          )
        )
      }
      const coinAmount = Exchange.convertCoinToCoin({
        coin,
        value: payment.value().amount || 0
      })
      // triggers email notification to user that
      // non-custodial funds were sent from the wallet
      if (fromType === ADDRESS_TYPES.ACCOUNT) {
        yield put(actions.core.wallet.triggerNonCustodialSendAlert(coin, coinAmount))
      }
      yield put(destroy(FORM))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(stopSubmit(FORM))
      // Set errors
      const error = errorHandler(e)
      if (fromType === ADDRESS_TYPES.LOCKBOX) {
        yield put(actions.components.lockbox.setConnectionError(e))
      } else {
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
              coinName: coinfig.name
            })
          )
        }
      }
    }
  }

  const regularFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFee = path(['fees', 'regular'], payment)
      yield put(change(FORM, 'fee', regularFee))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'regularFeeClicked', e))
    }
  }

  const checkIsContract = function* ({ payload }: { payload: string | EthAccountFromType }) {
    try {
      const p = yield select(S.getPayment)
      let payment = coreSagas.payment.eth.create({
        network: networks.eth,
        payment: p.getOrElse({})
      })
      yield put(A.sendEthCheckIsContractLoading())
      const { contract } = yield call(
        api.checkContract,
        typeof payload === 'string' ? payload : payload.address
      )
      const { account, fee } = yield select(selectors.form.getFormValues(FORM))
      payment = yield payment.setIsContract(contract)
      payment = yield payment.fee(fee, account)
      yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
      yield put(A.sendEthCheckIsContractSuccess(contract))
    } catch (e) {
      yield put(A.sendEthCheckIsContractFailure(e))
    }
  }

  const priorityFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const priorityFee = path(['fees', 'priority'], payment)
      yield put(change(FORM, 'fee', priorityFee))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'priorityFeeClicked', e))
    }
  }

  const minimumFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const minFee = path(['fees', 'limits', 'min'], payment)
      yield put(change(FORM, 'fee', minFee))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'minimumFeeClicked', e))
    }
  }

  const maximumFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFee = path(['fees', 'limits', 'max'], payment)
      yield put(change(FORM, 'fee', maxFee))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumFeeClicked', e))
    }
  }

  const setAmount = function* (
    amountInWei: string,
    coin: 'ETH' | Erc20CoinType,
    payment: EthPaymentType
  ) {
    const currency = selectors.core.settings
      .getCurrency(yield select())
      .getOrFail('Failed to get currency')
    const rates = selectors.core.data.coins
      .getRates(coin, yield select())
      .getOrFail(`Failed to get ${coin} rates`)
    const cryptoAmt = Exchange.convertCoinToCoin({
      coin,
      value: amountInWei
    })
    const fiatAmt = Exchange.convertCoinToFiat({ coin, currency, rates, value: amountInWei })
    yield put(
      change(FORM, 'amount', {
        coin: cryptoAmt,
        coinCode: coin,
        fiat: fiatAmt
      })
    )

    return yield payment.amount(amountInWei)
  }

  const setTo = function* (to: string, payment: EthPaymentType) {
    const prepareTo = (to) => {
      return to ? { value: { label: to, value: to } } : null
    }

    yield put(actions.form.change(FORM, 'to', prepareTo(to)))
    return yield payment.to(to)
  }

  const retrySendEth = function* ({ payload }: ReturnType<typeof A.retrySendEth>) {
    const { isErc20, txHash } = payload
    try {
      const tx: ReturnType<typeof api.getEthTransactionV2> = yield call(
        api.getEthTransactionV2,
        txHash
      )
      if (tx.state === 'CONFIRMED') {
        yield put(actions.alerts.displaySuccess(C.PAYMENT_CONFIRMED_SUCCESS))
        yield put(actions.core.data.eth.fetchTransactions())
        return
      }
      let coin = ETH
      if (isErc20) {
        coin =
          Object.keys(window.coins).find(
            (c: string) =>
              tx.to.toLowerCase() === window.coins[c].coinfig.type.erc20Address?.toLowerCase()
          ) || ETH
      }

      yield put(
        actions.modals.showModal('SEND_ETH_MODAL', {
          coin,
          origin: 'RetrySendEth'
        })
      )

      yield take(AT.SEND_ETH_PAYMENT_UPDATED_SUCCESS)
      const p = yield select(S.getPayment)
      let payment: EthPaymentType = coreSagas.payment.eth.create({
        network: networks.eth,
        payment: p.getOrElse({})
      })
      if (!isErc20) {
        payment = yield call(setAmount, tx.value, ETH, payment)
        payment = yield call(setTo, tx.to, payment)
      } else {
        if (!tx.data) throw new Error('NO_ERC20_DATA')
        const value = ethers.utils.defaultAbiCoder.decode(
          ['uint256'],
          `0x${'0'.repeat(64 - tx.data?.slice(120, 138).length)}${tx.data.slice(120, 138)}`
        )
        const to = ethers.utils.getAddress(`0x${tx.data?.slice(32, 72)}`)

        // @ts-ignore
        payment = yield call(setAmount, value, coin as Erc20CoinType, payment)
        payment = yield call(setTo, to, payment)
      }

      const feeFromPrevTx = new BigNumber(calculateFee(tx.gasPrice, tx.gasLimit, false))
      const minFeeRequiredForRetry = feeFromPrevTx.times(0.125).plus(feeFromPrevTx).toString()

      payment = yield payment.setIsRetryAttempt(true, tx.nonce, minFeeRequiredForRetry)

      yield put(A.sendEthPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.alerts.displayError(C.PLEASE_TRY_AGAIN))
    }
  }

  const fetchSendLimits = function* ({ payload }: ReturnType<typeof A.sendEthFetchLimits>) {
    const { currency, fromAccount, inputCurrency, outputCurrency, toAccount } = payload
    try {
      yield put(A.sendEthFetchLimitsLoading())
      const limitsResponse: ReturnType<typeof api.getCrossBorderTransactions> = yield call(
        api.getCrossBorderTransactions,
        inputCurrency,
        fromAccount,
        outputCurrency,
        toAccount,
        currency
      )
      yield put(A.sendEthFetchLimitsSuccess(limitsResponse))
    } catch (e) {
      yield put(A.sendEthFetchLimitsFailure(e))
    }
  }

  return {
    checkIsContract,
    destroyed,
    fetchSendLimits,
    firstStepSubmitClicked,
    formChanged,
    initialized,
    maximumAmountClicked,
    maximumFeeClicked,
    minimumFeeClicked,
    priorityFeeClicked,
    regularFeeClicked,
    retrySendEth,
    secondStepSubmitClicked
  }
}
