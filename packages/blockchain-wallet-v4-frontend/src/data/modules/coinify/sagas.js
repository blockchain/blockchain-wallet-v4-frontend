import { put, call, select } from 'redux-saga/effects'
import { any, merge, path, prop, equals, head } from 'ramda'
import { delay } from 'redux-saga'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import * as C from 'services/AlertService'
import * as service from 'services/CoinifyService'
import { promptForSecondPassword } from 'services/SagaService'

export const sellDescription = `Exchange Trade CNY-`
export const logLocation = 'modules/coinify/sagas'

export default ({ coreSagas, networks }) => {
  const coinifySignup = function*(data) {
    const country = data.payload
    try {
      yield call(coreSagas.data.coinify.signup, country)
      const profile = yield select(selectors.core.data.coinify.getProfile)
      if (!profile.error) {
        yield call(coreSagas.data.coinify.triggerKYC)
        yield put(A.coinifyNextStep('isx'))
      } else {
        yield put(A.coinifySignupFailure(JSON.parse(profile.error)))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'coinifySignup', e))
      yield put(actions.alerts.displayError(C.COINIFY_SIGNUP_ERROR))
    }
  }

  const coinifySaveMedium = function*(data) {
    const medium = data.payload
    yield put(A.saveMediumSuccess(medium))
  }

  const buy = function*(payload) {
    try {
      const nextAddressData = yield call(prepareAddress)
      const buyTrade = yield call(
        coreSagas.data.coinify.buy,
        payload,
        nextAddressData
      )

      if (!buyTrade) {
        const trade = yield select(selectors.core.data.coinify.getTrade)
        const parsed = JSON.parse(trade.error)

        yield put(A.coinifyFailure(parsed))
        return
      }

      if (buyTrade.medium === 'bank') {
        yield put(A.coinifyNextCheckoutStep('bankTransferDetails'))
      } else {
        yield put(A.coinifyNextCheckoutStep('isx'))
      }
      yield put(A.coinifyNotAsked())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'buy', e))
    }
  }

  const prepareAddress = function*() {
    try {
      const state = yield select()
      const defaultIdx = selectors.core.wallet.getDefaultAccountIndex(state)
      const receiveR = selectors.core.common.btc.getNextAvailableReceiveAddress(
        networks.btc,
        defaultIdx,
        state
      )
      const receiveIdxR = selectors.core.common.btc.getNextAvailableReceiveIndex(
        networks.btc,
        defaultIdx,
        state
      )
      return {
        address: receiveR.getOrElse(),
        index: receiveIdxR.getOrElse(),
        accountIndex: defaultIdx
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'prepareAddress', e))
    }
  }

  const sell = function*() {
    try {
      const password = yield call(promptForSecondPassword)
      yield put(A.coinifyLoading())
      const trade = yield call(coreSagas.data.coinify.sell)

      const state = yield select()

      if (!trade) {
        const trade = yield select(selectors.core.data.coinify.getTrade)
        const parsed = JSON.parse(trade.error)

        yield put(A.coinifyFailure(parsed))
        return
      }
      const p = path(['coinify', 'payment'], state)
      let payment = yield coreSagas.payment.btc.create({
        payment: p.getOrElse({}),
        network: networks.btc
      })
      payment = yield payment.amount(parseInt(trade.sendAmount))

      // QA Tool: manually set a "to" address on the payment object for testing sell
      const qaAddress = path(['qa', 'qaSellAddress'], state)
      if (qaAddress) {
        payment = yield payment.to(qaAddress)
      } else {
        payment = yield payment.to(
          path(['transferIn', 'details', 'account'], trade)
        )
      }

      payment = yield payment.description(`${sellDescription}${trade.id}`)
      try {
        payment = yield payment.build()
      } catch (e) {
        throw new Error('could not build payment')
      }

      payment = yield payment.sign(password)
      payment = yield payment.publish()

      yield put(actions.core.data.bitcoin.fetchData())
      yield put(
        actions.core.wallet.setTransactionNote(
          payment.value().txId,
          payment.value().description
        )
      )

      yield put(A.coinifySuccess())
      yield put(
        actions.form.change('buySellTabStatus', 'status', 'order_history')
      )
      yield put(actions.modals.showModal('CoinifyTradeDetails', { trade }))
      yield put(A.initializePayment())
    } catch (e) {
      yield put(A.coinifyFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'sell', e))
    }
  }

  const initialized = function*(action) {
    try {
      const { type } = action.payload
      const level = yield select(selectors.core.data.coinify.getLevel)
      const currency = level.map(l => l.currency).getOrElse('EUR')

      const initialValues = {
        leftVal: '',
        rightVal: '',
        currency: currency
      }

      let error = false

      if (type === 'buy') {
        yield put(actions.form.initialize('coinifyCheckoutBuy', initialValues))
      } else {
        yield put(actions.form.initialize('coinifyCheckoutSell', initialValues))
        const limitsR = yield select(selectors.core.data.coinify.getLimits)
        const limits = limitsR.getOrElse(undefined)
        const defaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        const payment = yield coreSagas.payment.btc
          .create({ network: networks.btc })
          .chain()
          .init()
          .fee('priority')
          .from(defaultIndex)
          .done()
        const effectiveBalance = prop('effectiveBalance', payment.value())
        const isMinOverEffectiveMax = service.isMinOverEffectiveMax(
          limits,
          effectiveBalance,
          currency
        )
        if (isMinOverEffectiveMax) {
          error = 'effective_max_under_min'
        }
      }
      yield put(actions.core.data.coinify.fetchRateQuote(currency, type))
      yield put(A.setCoinifyCheckoutError(error))
      yield put(A.coinifyCheckoutBusyOn())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const checkoutCardMax = function*(action) {
    try {
      const { card } = action.payload
      const levelR = yield select(selectors.core.data.coinify.getLevel)
      const currency = levelR.map(l => l.currency).getOrElse('EUR')
      const cardMax = path([currency], card.inRemaining)
      yield put(actions.form.change('coinifyCheckoutBuy', 'leftVal', cardMax))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'checkoutCardMax', e))
    }
  }

  const handleChange = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!any(equals(form))(['coinifyCheckoutBuy', 'coinifyCheckoutSell'])) {
        return
      }
      yield put(A.coinifyCheckoutBusyOn())
      if (!payload) return null

      const limitsR = yield select(selectors.core.data.coinify.getLimits)
      const limits = limitsR.getOrElse(undefined)
      const values = yield select(selectors.form.getFormValues(form))
      const type = form === 'coinifyCheckoutBuy' ? 'buy' : 'sell'
      const isSell = type === 'sell'
      const state = yield select()

      switch (field) {
        case 'leftVal':
          if (!isSell) {
            const leftLimitsError = service.getLimitsError(
              payload,
              limits,
              values.currency,
              type
            )
            if (leftLimitsError) {
              yield put(A.setCoinifyCheckoutError(leftLimitsError))
              return
            } else {
              yield put(A.clearCoinifyCheckoutError())
            }
          }

          const leftResult = yield call(coreSagas.data.coinify.fetchQuote, {
            quote: {
              amount: payload * 100,
              baseCurrency: values.currency,
              quoteCurrency: 'BTC',
              type
            }
          })
          const amount = Math.abs(leftResult.quoteAmount)

          if (isSell) {
            let btcAmt = amount / 1e8
            const payment = path(['coinify', 'payment'], state)
            const effectiveBalance = prop(
              'effectiveBalance',
              payment.getOrElse(undefined)
            )
            const overEffectiveMaxError = service.getOverEffectiveMaxError(
              amount,
              limits,
              values.currency,
              effectiveBalance
            )
            if (overEffectiveMaxError) {
              yield put(A.setCoinifyCheckoutError(overEffectiveMaxError))
            } else {
              const leftLimitsError = service.getLimitsError(
                btcAmt,
                limits,
                values.currency,
                type
              )
              if (leftLimitsError) {
                yield put(A.setCoinifyCheckoutError(leftLimitsError))
              } else {
                yield put(A.clearCoinifyCheckoutError())
              }
            }
          }

          yield put(
            actions.form.initialize(
              form,
              merge(values, { rightVal: amount / 1e8 })
            )
          )
          yield put(A.coinifyCheckoutBusyOff())
          break
        case 'rightVal':
          if (isSell) {
            const payment = path(['coinify', 'payment'], state)
            const effectiveBalance = prop(
              'effectiveBalance',
              payment.getOrElse(undefined)
            )
            const overEffectiveMaxError = service.getOverEffectiveMaxError(
              payload * 1e8,
              limits,
              values.currency,
              effectiveBalance
            )
            if (overEffectiveMaxError) {
              yield put(A.setCoinifyCheckoutError(overEffectiveMaxError))
              return
            }

            const rightLimitsError = service.getLimitsError(
              payload,
              limits,
              values.currency,
              type
            )
            if (rightLimitsError) {
              yield put(A.setCoinifyCheckoutError(rightLimitsError))
              return
            } else {
              yield put(A.clearCoinifyCheckoutError())
            }
          }

          const rightResult = yield call(coreSagas.data.coinify.fetchQuote, {
            quote: {
              amount: Math.round(payload * 1e8 * -1),
              baseCurrency: 'BTC',
              quoteCurrency: values.currency,
              type
            }
          })
          const fiatAmount = Math.abs(rightResult.quoteAmount)

          const amt = isSell ? payload : fiatAmount
          const rightLimitsError = service.getLimitsError(
            amt,
            limits,
            values.currency,
            type
          )
          if (rightLimitsError) {
            yield put(A.setCoinifyCheckoutError(rightLimitsError))
            yield put(
              actions.form.initialize(
                form,
                merge(values, { leftVal: fiatAmount })
              )
            )
          } else {
            yield put(A.clearCoinifyCheckoutError())
          }
          yield put(
            actions.form.initialize(
              form,
              merge(values, { leftVal: fiatAmount })
            )
          )
          yield put(A.coinifyCheckoutBusyOff())
          break
        case 'currency':
          yield put(actions.core.data.coinify.fetchRateQuote(payload))
          yield put(
            actions.form.initialize(
              form,
              merge(values, { leftVal: '', rightVal: '' })
            )
          )
          yield put(A.coinifyCheckoutBusyOn())
          break
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'handleChange', e))
    }
  }

  const fromISX = function*(action) {
    const status = action.payload
    try {
      const modals = yield select(selectors.modals.getModals)
      const tradeR = yield select(selectors.core.data.coinify.getTrade)
      const trade = tradeR.getOrElse({})

      if (path(['type'], head(modals)) === 'CoinifyExchangeData') {
        yield put(A.coinifySignupComplete())
        yield call(delay, 500)
        yield put(actions.modals.closeAllModals())
      } else if (path(['constructor', 'name'], trade) !== 'Trade') {
        yield put(actions.form.change('buySellTabStatus', 'status', 'buy'))
      } else {
        yield put(
          actions.form.change('buySellTabStatus', 'status', 'order_history')
        )
      }
      yield put(A.coinifyNextCheckoutStep('checkout'))
      yield put(
        actions.modals.showModal('CoinifyTradeDetails', {
          trade: trade,
          status: status
        })
      )
      yield call(coreSagas.data.coinify.getKYC)
      yield put(actions.core.data.coinify.pollKYCPending())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'fromISX', e))
    }
  }

  const triggerKYC = function*() {
    try {
      yield call(coreSagas.data.coinify.triggerKYC)
      yield put(A.coinifyNextCheckoutStep('isx'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'triggerKYC', e))
    }
  }

  const openKYC = function*(data) {
    let kyc = data.payload
    const recentKycR = yield select(selectors.core.data.coinify.getKyc)
    const recentKyc = recentKycR.getOrElse(undefined)

    try {
      if (!data.payload && !equals(prop('state', recentKyc), 'pending')) {
        yield call(triggerKYC)
      } else if (
        equals(prop('state', kyc), 'pending') ||
        equals(prop('state', recentKyc), 'pending')
      ) {
        yield call(coreSagas.data.coinify.kycAsTrade, {
          kyc: kyc || recentKyc
        }) // if no kyc was given, take the most recent
        yield put(A.coinifyNextCheckoutStep('isx'))
      } else {
        yield call(triggerKYC)
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'openKYC', e))
    }
  }

  const deleteBankAccount = function*(payload) {
    try {
      yield call(coreSagas.data.coinify.deleteBankAccount, payload)
      const quote = yield select(selectors.core.data.coinify.getQuote)
      yield put(
        actions.core.data.coinify.getMediumsWithBankAccounts(quote.data)
      )
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deleteBankAccount', e)
      )
    }
  }

  const finishTrade = function*(data) {
    const tradeToFinish = data.payload
    try {
      if (tradeToFinish.state === 'awaiting_transfer_in') {
        yield put(actions.core.data.coinify.handleTradeSuccess(tradeToFinish))
        if (tradeToFinish.medium === 'card') {
          yield call(coreSagas.data.coinify.kycAsTrade, { kyc: tradeToFinish }) // core expects obj key to be 'kyc'
          yield put(A.coinifyNextCheckoutStep('isx'))
        } else if (tradeToFinish.medium === 'bank') {
          yield put(
            actions.modals.showModal('CoinifyTradeDetails', {
              trade: tradeToFinish
            })
          )
        }
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'finishTrade', e))
    }
  }

  const cancelISX = function*() {
    const modals = yield select(selectors.modals.getModals)
    const tradeR = yield select(selectors.core.data.coinify.getTrade)
    const trade = tradeR.getOrElse({})

    if (path(['type'], head(modals)) === 'CoinifyExchangeData') {
      yield put(actions.modals.closeAllModals())
    } else if (prop('state', trade) === 'awaiting_transfer_in') {
      yield put(
        actions.form.change('buySellTabStatus', 'status', 'order_history')
      )
      yield put(A.coinifyNextCheckoutStep('checkout'))
    } else {
      yield put(A.coinifyNextCheckoutStep('checkout'))
    }
  }

  const cancelTrade = function*(data) {
    const trade = data.payload
    try {
      yield put(A.setCancelTradeId(trade.id))
      yield put(A.coinifyLoading())
      yield call(coreSagas.data.coinify.cancelTrade, { trade })
      yield put(A.coinifySuccess())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'cancelTrade', e))
    }
  }

  const cancelSubscription = function*(data) {
    const id = path(['payload', 'id'], data)
    try {
      yield put(A.coinifyLoading())
      yield call(coreSagas.data.coinify.cancelSubscription, { id })
      yield put(A.coinifySuccess())
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'cancelSubscription', e)
      )
    }
  }

  const initializePayment = function*() {
    try {
      yield put(A.coinifySellBtcPaymentUpdatedLoading())
      let payment = coreSagas.payment.btc.create({
        network: networks.btc
      })
      payment = yield payment.init()
      const defaultIndex = yield select(
        selectors.core.wallet.getDefaultAccountIndex
      )
      const defaultFeePerByte = path(['fees', 'priority'], payment.value())
      payment = yield payment.from(defaultIndex)
      payment = yield payment.fee(defaultFeePerByte)
      yield put(A.coinifySellBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.coinifySellBtcPaymentUpdatedFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializePayment', e)
      )
    }
  }

  return {
    buy,
    cancelISX,
    cancelSubscription,
    cancelTrade,
    checkoutCardMax,
    coinifySaveMedium,
    coinifySignup,
    deleteBankAccount,
    finishTrade,
    fromISX,
    handleChange,
    initialized,
    initializePayment,
    openKYC,
    prepareAddress,
    sell,
    triggerKYC
  }
}
