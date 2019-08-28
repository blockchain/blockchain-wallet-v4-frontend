import { put, call, select } from 'redux-saga/effects'
import { any, merge, path, prop, equals, length } from 'ramda'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import * as C from 'services/AlertService'
import * as service from 'services/CoinifyService'
import * as S from './selectors'
import * as model from '../../model'
import { promptForSecondPassword } from 'services/SagaService'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import * as coinifyModel from './model'

const { STEPS } = model.components.identityVerification
const { TIERS_STATES } = model.profile
const {
  COINIFY_CHECKOUT_STEPS,
  TRADE_DETAILS_MODAL,
  COINIFY_BUY_FORM,
  COINIFY_SELL_FORM,
  COINIFY_USER_LEVELS
} = coinifyModel

export const sellDescription = `Exchange Trade CNY-`
export const logLocation = 'components/coinify/sagas'

export default ({ api, coreSagas, networks }) => {
  const coinifySignup = function * () {
    try {
      yield put(A.coinifyLoading())
      const country = yield select(S.getCoinifyCountry)
      yield call(coreSagas.data.coinify.signup, country)
      const profileR = yield select(selectors.core.data.coinify.getProfile)

      if (profileR.error)
        return yield put(A.coinifyFailure(JSON.parse(profileR.error)))

      yield put(A.coinifyNotAsked())

      const userTiersR = yield select(selectors.modules.profile.getUserTiers)
      const userTiers = userTiersR.getOrElse({
        current: 0,
        selected: 2,
        next: 1
      })
      const { current } = userTiers
      const step = current === 0 ? STEPS.personal : STEPS.verify

      yield call(sendCoinifyKYC)

      if (current < 2) {
        return yield put(
          actions.components.identityVerification.setVerificationStep(step)
        )
      } else {
        return yield put(actions.modals.closeAllModals())
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'coinifySignup', e))
      yield put(actions.alerts.displayError(C.COINIFY_SIGNUP_ERROR))
    }
  }

  const checkIfFirstTrade = function * () {
    // TODO: subject to change - this implemtation is for sending KYC docs upon first trade
    const trades = yield select(selectors.core.data.coinify.getTrades)
    if (length(trades) === 0) yield call(sendCoinifyKYC)
  }

  const checkCountryState = function * () {
    const nabuStateCode = (yield select(
      selectors.modules.profile.getUserStateCode
    )).getOrFail('no state code')
    const nabuCountryCode = (yield select(
      selectors.modules.profile.getUserCountryCode
    )).getOrFail('no country code')
    const availableCountryStates = yield call(api.getCoinifyStates)
    if (nabuStateCode && nabuCountryCode === 'US') {
      const supportedState = path(
        ['US', 'states', nabuStateCode, 'supported'],
        availableCountryStates
      )
      if (!supportedState) throw new Error('State is not supported')
    } else {
      const supportedCountry = path(
        [nabuCountryCode, 'supported'],
        availableCountryStates
      )
      if (!supportedCountry) throw new Error('Country is not supported')
    }
  }

  const buy = function * (payload) {
    try {
      yield call(checkIfFirstTrade)
      yield call(checkCountryState)
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
        yield put(A.coinifyNextCheckoutStep(COINIFY_CHECKOUT_STEPS.BANK))
      } else {
        yield put(A.coinifyNextCheckoutStep(COINIFY_CHECKOUT_STEPS.ISX))
      }
      yield put(A.coinifyNotAsked())
    } catch (e) {
      let error
      try {
        error = e.message
      } catch (parseError) {
        error = e
      }
      yield put(A.coinifyFailure({ error }))
      yield put(actions.logs.logErrorMessage(logLocation, 'buy', error))
    }
  }

  const prepareAddress = function * () {
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

  const sell = function * () {
    try {
      yield call(checkIfFirstTrade)
      yield call(checkCountryState)
      const password = yield call(promptForSecondPassword)
      yield put(A.coinifyLoading())
      const trade = yield call(coreSagas.data.coinify.sell)

      if (!trade) {
        const trade = yield select(selectors.core.data.coinify.getTrade)
        const parsed = JSON.parse(trade.error)

        yield put(A.coinifyFailure(parsed))
        return
      }
      const state = yield select()
      const p = yield select(S.getCoinifyPayment)

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

      yield put(actions.core.data.btc.fetchData())
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
      yield put(actions.modals.showModal(TRADE_DETAILS_MODAL, { trade }))
      yield put(A.initializePayment())
    } catch (e) {
      yield put(A.coinifyFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'sell', e))
    }
  }

  const initialized = function * (action) {
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
        yield put(actions.form.initialize(COINIFY_BUY_FORM, initialValues))
      } else {
        yield put(actions.form.initialize(COINIFY_SELL_FORM, initialValues))
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
          .from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
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

  const handleChange = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!any(equals(form))([COINIFY_BUY_FORM, COINIFY_SELL_FORM])) {
        return
      }
      yield put(A.coinifyCheckoutBusyOn())
      if (!payload) return null

      const limitsR = yield select(selectors.core.data.coinify.getLimits)
      const limits = limitsR.getOrElse(undefined)
      const values = yield select(selectors.form.getFormValues(form))
      const type = form === COINIFY_BUY_FORM ? 'buy' : 'sell'
      const isSell = type === 'sell'

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
            const payment = yield select(S.getCoinifyPayment)
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
            const payment = yield select(S.getCoinifyPayment)
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

  const fromISX = function * (action) {
    const status = action.payload
    try {
      const tradeR = yield select(selectors.core.data.coinify.getTrade)
      const trade = tradeR.getOrElse({})
      // eslint-disable-next-line
      console.log('fromISX', trade)

      yield put(
        actions.form.change('buySellTabStatus', 'status', 'order_history')
      )
      yield put(A.coinifyNextCheckoutStep('checkout'))
      yield put(
        actions.modals.showModal('CoinifyTradeDetails', {
          trade: trade,
          status: status
        })
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'fromISX', e))
    }
  }

  const deleteBankAccount = function * (payload) {
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

  const finishTrade = function * (data) {
    const tradeToFinish = data.payload
    try {
      if (tradeToFinish.state === 'awaiting_transfer_in') {
        yield put(actions.core.data.coinify.handleTradeSuccess(tradeToFinish))
        if (tradeToFinish.medium === 'card') {
          yield call(coreSagas.data.coinify.kycAsTrade, { kyc: tradeToFinish }) // core expects obj key to be 'kyc'
          yield put(A.coinifyNextCheckoutStep(COINIFY_CHECKOUT_STEPS.ISX))
        } else if (tradeToFinish.medium === 'bank') {
          yield put(
            actions.modals.showModal(TRADE_DETAILS_MODAL, {
              trade: tradeToFinish
            })
          )
        }
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'finishTrade', e))
    }
  }

  const cancelTrade = function * (data) {
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

  const cancelSubscription = function * (data) {
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

  const initializePayment = function * () {
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
      payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
      payment = yield payment.fee(defaultFeePerByte)
      yield put(A.coinifySellBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.coinifySellBtcPaymentUpdatedFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializePayment', e)
      )
    }
  }

  const sendCoinifyKYC = function * () {
    try {
      const coinifyUserR = yield select(
        selectors.core.kvStore.buySell.getCoinifyUser
      )
      const user = coinifyUserR.getOrElse(null)
      if (user) yield call(api.sendCoinifyKyc, user)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'sendCoinifyKyc', e))
    }
  }

  const fetchCoinifyData = function * () {
    try {
      yield put(actions.core.data.coinify.fetchTrades())
      yield put(actions.core.data.coinify.getKyc())
      yield put(actions.core.data.coinify.fetchSubscriptions())
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'fetchCoinifyData', e)
      )
    }
  }

  const compareKyc = function * () {
    try {
      const tier2DataR = yield select(selectors.modules.profile.getTier, 2)
      const tier2State = prop('state', tier2DataR.getOrElse(null))
      const profileLevel = (yield select(
        selectors.core.data.coinify.getLevel
      )).getOrElse(null)
      const levelName = prop('name', profileLevel)

      // if wallet says user is tier 2 verified but coinify says they are level 1, we tell backend to update
      if (
        equals(tier2State, TIERS_STATES.VERIFIED) &&
        equals(levelName, COINIFY_USER_LEVELS.ONE)
      ) {
        const coinifyUserR = yield select(selectors.core.data.coinify.getUserId)
        const user = coinifyUserR.getOrElse(null)
        if (user) yield call(api.sendCoinifyKyc, user)
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'compareKyc', e))
    }
  }

  const cancelISX = function * () {
    const tradeR = yield select(selectors.core.data.coinify.getTrade)
    const trade = tradeR.getOrElse({})
    if (prop('state', trade) === 'awaiting_transfer_in') {
      yield put(
        actions.form.change('buySellTabStatus', 'status', 'order_history')
      )
    }
    yield put(A.coinifyNextCheckoutStep(COINIFY_CHECKOUT_STEPS.CHECKOUT))
  }

  return {
    buy,
    cancelISX,
    cancelSubscription,
    cancelTrade,
    checkIfFirstTrade,
    coinifySignup,
    compareKyc,
    deleteBankAccount,
    fetchCoinifyData,
    finishTrade,
    fromISX,
    handleChange,
    initialized,
    initializePayment,
    prepareAddress,
    sell,
    sendCoinifyKYC
  }
}
