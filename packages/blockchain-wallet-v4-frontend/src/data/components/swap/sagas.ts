import { call, delay, put, select, take } from 'redux-saga/effects'

import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import {
  CoinType,
  Erc20CoinsEnum,
  PaymentType,
  PaymentValue,
  SwapQuoteType
} from 'blockchain-wallet-v4/src/types'
import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { getDirection, getPair, getRate, NO_QUOTE } from './utils'
import {
  InitSwapFormValuesType,
  SwapAccountType,
  SwapAmountFormValues
} from './types'
import { MempoolFeeType } from '../exchange/types'
import BigNumber from 'bignumber.js'

import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import profileSagas from '../../../data/modules/profile/sagas'
import sendSagas from '../send/sagas'

const DELAY = 60_000 * 2

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas
  networks
}) => {
  const { buildAndPublishPayment, paymentGetOrElse } = sendSagas({
    api,
    coreSagas,
    networks
  })
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  const cancelOrder = function * ({ payload }: ReturnType<typeof A.cancelOrder>) {
    try {
      yield put(actions.form.startSubmit('swapOrderDetails'))
      yield call(api.cancelSwapOrder, payload.id)
      yield put(actions.form.stopSubmit('swapOrderDetails'))
      yield put(A.setStep({ step: 'INIT_SWAP' }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('swapOrderDetails', { _error: error }))
    }
  }

  const changePair = function * ({ payload }: ReturnType<typeof A.changePair>) {
    yield put(actions.form.change('initSwap', payload.side, payload.account))
    yield put(A.setStep({ step: 'INIT_SWAP' }))
  }

  const calculateProvisionalPayment = function * (
    source: SwapAccountType,
    quote: SwapQuoteType,
    amount,
    fee: MempoolFeeType = 'priority'
  ): Generator<
    any,
    PaymentValue | { coin: CoinType; effectiveBalance: number },
    PaymentType
  > {
    try {
      const coin = source.coin
      const addressOrIndex = source.address
      const addressType = source.type
      const isSourceErc20 = coin in Erc20CoinsEnum
      const paymentType = isSourceErc20 ? 'eth' : coin.toLowerCase()
      let payment: PaymentType = yield coreSagas.payment[paymentType]
        .create({ network: networks[paymentType] })
        .chain()
        .init({ isErc20: isSourceErc20, coin })
        .fee(fee)
        .from(addressOrIndex, addressType)
        .done()

      switch (payment.coin) {
        case 'PAX':
        case 'USDT':
        case 'ETH':
        case 'XLM':
          payment = yield payment.amount(convertStandardToBase(coin, amount))
          return payment.value()
        default:
          payment = yield payment.amount(
            parseInt(convertStandardToBase(coin, amount))
          )
          return (yield payment
            .chain()
            .to(quote.sampleDepositAddress, 'ADDRESS')
            .build()
            .done()).value()
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log(e)
      return { coin: source.coin, effectiveBalance: 0 }
    }
  }

  const createOrder = function * () {
    try {
      yield put(actions.form.startSubmit('previewSwap'))
      const initSwapFormValues = selectors.form.getFormValues('initSwap')(
        yield select()
      ) as InitSwapFormValuesType
      const swapAmountFormValues = selectors.form.getFormValues('swapAmount')(
        yield select()
      ) as SwapAmountFormValues
      if (
        !initSwapFormValues ||
        !initSwapFormValues.BASE ||
        !initSwapFormValues.COUNTER
      ) {
        throw new Error('NO_INIT_SWAP_FORM_VALUES')
      }
      if (!swapAmountFormValues || !swapAmountFormValues.amount) {
        throw new Error('NO_SWAP_AMOUNT_FORM_VALUES')
      }

      const { BASE, COUNTER } = initSwapFormValues

      const direction = getDirection(BASE, COUNTER)
      const amount = convertStandardToBase(
        BASE.coin,
        swapAmountFormValues.amount
      )
      const quote = S.getQuote(yield select()).getOrFail('NO_SWAP_QUOTE')
      const order: ReturnType<typeof api.createSwapOrder> = yield call(
        api.createSwapOrder,
        direction,
        quote.quote.id,
        amount
      )
      const paymentR = S.getPayment(yield select())
      let payment = paymentGetOrElse(BASE.coin, paymentR)
      if (direction === 'FROM_USERKEY' || direction === 'ON_CHAIN') {
        yield call(
          buildAndPublishPayment,
          payment.coin,
          payment,
          order.kind.depositAddress
        )
      }
      yield put(actions.form.stopSubmit('previewSwap'))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('previewSwap', { _error: error }))
    }
  }

  const fetchLimits = function * () {
    try {
      yield put(A.fetchLimitsLoading())
      const limits: ReturnType<typeof api.getSwapLimits> = yield call(
        api.getSwapLimits,
        selectors.core.settings.getCurrency(yield select()).getOrElse('USD')
      )
      yield put(A.fetchLimitsSuccess(limits))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchLimitsFailure(error))
    }
  }

  const fetchQuote = function * () {
    while (true) {
      try {
        yield put(A.fetchQuoteLoading())
        const initSwapFormValues = selectors.form.getFormValues('initSwap')(
          yield select()
        ) as InitSwapFormValuesType
        if (
          !initSwapFormValues ||
          !initSwapFormValues.BASE ||
          !initSwapFormValues.COUNTER
        ) {
          return yield put(A.setStep({ step: 'INIT_SWAP' }))
        }

        const { BASE, COUNTER } = initSwapFormValues

        const pair = getPair(BASE, COUNTER)
        const direction = getDirection(BASE, COUNTER)
        const quote: ReturnType<typeof api.getSwapQuote> = yield call(
          api.getSwapQuote,
          pair,
          direction
        )
        const rate = getRate(quote.quote.priceTiers, new BigNumber(1))
        yield put(A.fetchQuoteSuccess(quote, rate))
        yield delay(DELAY)
      } catch (e) {
        const error = errorHandler(e)
        yield put(A.fetchQuoteFailure(error))
        yield delay(DELAY)
        yield put(A.startPollQuote())
      } finally {
      }
    }
  }

  const fetchTrades = function * () {
    try {
      yield call(waitForUserData)
      yield put(A.fetchTradesLoading())
      const trades = yield call(api.getSwapTrades)
      yield put(A.fetchTradesSuccess(trades))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchTradesFailure(error))
    }
  }

  const formChanged = function * (action) {
    if (action.meta.form !== 'swapAmount') return
    if (action.meta.field !== 'amount') return

    const initSwapFormValues = selectors.form.getFormValues('initSwap')(
      yield select()
    ) as InitSwapFormValuesType
    if (!initSwapFormValues || !initSwapFormValues.BASE) return

    const { BASE } = initSwapFormValues
    const paymentR = S.getPayment(yield select())
    if (BASE.type === 'CUSTODIAL') return

    // @ts-ignore
    let payment = paymentGetOrElse(BASE.coin, paymentR)
    const value = Number(action.payload)

    switch (payment.coin) {
      case 'BCH':
      case 'BTC':
        payment = yield payment.amount(
          parseInt(convertStandardToBase(payment.coin, value))
        )
        break
      case 'ETH':
      case 'PAX':
      case 'USDT':
      case 'XLM':
        payment = yield payment.amount(
          convertStandardToBase(payment.coin, value)
        )
        break
      default:
        throw new Error(INVALID_COIN_TYPE)
    }

    yield put(A.updatePaymentSuccess(payment.value()))
  }

  const initAmountForm = function * () {
    let payment: PaymentValue
    let balance: number = 0
    try {
      yield put(A.startPollQuote())
      yield put(A.updatePaymentLoading())
      const initSwapFormValues = selectors.form.getFormValues('initSwap')(
        yield select()
      ) as InitSwapFormValuesType
      // TODO: SWAP, race success/failure and handle error
      yield take(AT.FETCH_QUOTE_SUCCESS)
      const quote = S.getQuote(yield select()).getOrFail(NO_QUOTE)
      if (!initSwapFormValues || !initSwapFormValues.BASE) {
        return yield put(A.setStep({ step: 'INIT_SWAP' }))
      }
      const { BASE } = initSwapFormValues
      if (BASE.type === 'ACCOUNT') {
        payment = yield call(calculateProvisionalPayment, BASE, quote.quote, 0)
        balance = payment.effectiveBalance
        yield put(A.updatePaymentSuccess(payment))
      } else {
        balance = BASE.balance
        yield put(A.updatePaymentSuccess(undefined))
      }

      yield put(
        actions.form.change(
          'swapAmount',
          'amount',
          convertBaseToStandard(BASE.coin, balance)
        )
      )
      yield put(A.fetchLimits())
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.updatePaymentFailure(error))
    }
  }

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin, baseCurrency, counterCurrency } = payload
    yield put(
      actions.modals.showModal('SWAP_MODAL', {
        origin,
        baseCurrency,
        counterCurrency
      })
    )

    const latestPendingOrder = S.getLatestPendingSwapTrade(yield select())

    if (latestPendingOrder) {
      yield put(
        A.setStep({
          step: 'ORDER_DETAILS',
          options: { order: latestPendingOrder }
        })
      )
    }
  }

  const toggleBaseAndCounter = function * () {
    const initSwapFormValues = selectors.form.getFormValues('initSwap')(
      yield select()
    ) as InitSwapFormValuesType
    if (
      !initSwapFormValues ||
      !initSwapFormValues.BASE ||
      !initSwapFormValues.COUNTER
    ) {
      return yield put(A.setStep({ step: 'INIT_SWAP' }))
    }

    const { BASE: currentBase, COUNTER: currentCounter } = initSwapFormValues

    yield put(actions.form.change('initSwap', 'BASE', currentCounter))
    yield put(actions.form.change('initSwap', 'COUNTER', currentBase))

    yield put(A.initAmountForm())
  }

  return {
    cancelOrder,
    changePair,
    createOrder,
    fetchLimits,
    fetchQuote,
    fetchTrades,
    formChanged,
    initAmountForm,
    showModal,
    toggleBaseAndCounter
  }
}
