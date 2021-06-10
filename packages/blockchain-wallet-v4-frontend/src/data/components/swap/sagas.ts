import BigNumber from 'bignumber.js'
import moment from 'moment'
import { call, delay, put, race, select, take } from 'redux-saga/effects'

import { Exchange } from 'blockchain-wallet-v4/src'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import {
  CoinType,
  Erc20CoinsEnum,
  PaymentType,
  PaymentValue,
  SwapQuoteType
} from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { actions, selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { generateProvisionalPaymentAmount } from 'data/coins/utils'

import profileSagas from '../../modules/profile/sagas'
import { convertStandardToBase } from '../exchange/services'
import sendSagas from '../send/sagas'
import { selectReceiveAddress } from '../utils/sagas'
import * as A from './actions'
import * as AT from './actionTypes'
import { FALLBACK_DELAY } from './model'
import * as S from './selectors'
import {
  InitSwapFormValuesType,
  MempoolFeeType,
  SwapAccountType,
  SwapAmountFormValues,
  SwapBaseCounterTypes
} from './types'
import { getDirection, getPair, getRate, NO_QUOTE } from './utils'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas; networks }) => {
  const { buildAndPublishPayment, paymentGetOrElse } = sendSagas({
    api,
    coreSagas,
    networks
  })
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  const cancelOrder = function* ({ payload }: ReturnType<typeof A.cancelOrder>) {
    try {
      yield put(actions.form.startSubmit('swapOrderDetails'))
      yield call(api.cancelSwapOrder, payload.id)
      yield put(actions.form.stopSubmit('swapOrderDetails'))
      yield put(actions.components.refresh.refreshClicked())
      yield put(A.setStep({ step: 'INIT_SWAP' }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('swapOrderDetails', { _error: error }))
    }
  }

  const changeBase = function* ({ payload }: ReturnType<typeof A.changeBase>) {
    yield put(actions.form.change('initSwap', 'BASE', payload.account))
    const initSwapFormValues = selectors.form.getFormValues('initSwap')(
      yield select()
    ) as InitSwapFormValuesType

    if (initSwapFormValues?.BASE && initSwapFormValues?.COUNTER) {
      yield put(
        A.setStep({
          options: {
            account: payload.account.type,
            coin: payload.account.coin,
            side: 'BASE'
          },
          step: 'ENTER_AMOUNT'
        })
      )
    } else {
      yield put(
        A.setStep({
          options: {
            account: payload.account.type,
            coin: payload.account.coin,
            side: 'BASE'
          },
          step: 'INIT_SWAP'
        })
      )
    }
  }

  const changeCounter = function* ({ payload }: ReturnType<typeof A.changeCounter>) {
    yield put(actions.form.change('initSwap', 'COUNTER', payload.account))
    const initSwapFormValues = selectors.form.getFormValues('initSwap')(
      yield select()
    ) as InitSwapFormValuesType

    if (initSwapFormValues?.BASE && initSwapFormValues?.COUNTER) {
      yield put(
        A.setStep({
          options: {
            account: payload.account.type,
            coin: payload.account.coin,
            side: 'COUNTER'
          },
          step: 'ENTER_AMOUNT'
        })
      )
    } else {
      yield put(
        A.setStep({
          options: {
            account: payload.account.type,
            coin: payload.account.coin,
            side: 'COUNTER'
          },
          step: 'INIT_SWAP'
        })
      )
    }
  }

  const changeTrendingPair = function* ({ payload }: ReturnType<typeof A.changeTrendingPair>) {
    yield put(actions.form.change('initSwap', 'BASE', payload.baseAccount))
    yield put(actions.form.change('initSwap', 'COUNTER', payload.counterAccount))
    yield put(A.setStep({ step: 'ENTER_AMOUNT' }))
  }

  const calculateProvisionalPayment = function* (
    source: SwapAccountType,
    quote: SwapQuoteType,
    amount,
    fee: MempoolFeeType = 'priority'
  ): Generator<any, PaymentValue | { coin: CoinType; effectiveBalance: number }, PaymentType> {
    try {
      const { coin } = source
      const addressOrIndex = source.address
      const addressType = source.type
      const isSourceErc20 = coin in Erc20CoinsEnum
      const paymentType = isSourceErc20 ? 'eth' : coin.toLowerCase()
      let payment: PaymentType = yield coreSagas.payment[paymentType]
        .create({ network: networks[paymentType] })
        .chain()
        .init({ coin, isErc20: isSourceErc20 })
        .fee(fee)
        .from(addressOrIndex, addressType)
        .done()

      const paymentAmount = generateProvisionalPaymentAmount(coin, amount)
      payment = yield payment.amount(paymentAmount)
      // TODO, add isMemoBased check
      const sampleAddr = quote.sampleDepositAddress.split(':')[0]
      return (yield payment.chain().to(sampleAddr, 'ADDRESS').build().done()).value()
    } catch (e) {
      // eslint-disable-next-line
      console.log(e)
      return { coin: source.coin, effectiveBalance: 0 }
    }
  }

  const createOrder = function* () {
    let onChain = false
    let toChain = false

    try {
      yield put(actions.form.startSubmit('previewSwap'))
      const initSwapFormValues = selectors.form.getFormValues('initSwap')(
        yield select()
      ) as InitSwapFormValuesType
      const swapAmountFormValues = selectors.form.getFormValues('swapAmount')(
        yield select()
      ) as SwapAmountFormValues
      if (!initSwapFormValues || !initSwapFormValues.BASE || !initSwapFormValues.COUNTER) {
        throw new Error('NO_INIT_SWAP_FORM_VALUES')
      }
      if (!swapAmountFormValues || !swapAmountFormValues.amount) {
        throw new Error('NO_SWAP_AMOUNT_FORM_VALUES')
      }

      const ccy = selectors.core.settings.getCurrency(yield select()).getOrElse('USD')

      const { BASE, COUNTER } = initSwapFormValues

      const direction = getDirection(BASE, COUNTER)
      onChain = direction === 'ON_CHAIN' || direction === 'FROM_USERKEY'
      toChain = direction === 'ON_CHAIN' || direction === 'TO_USERKEY'

      const amount = convertStandardToBase(BASE.coin, swapAmountFormValues.cryptoAmount)

      const quote = S.getQuote(yield select()).getOrFail('NO_SWAP_QUOTE')
      const refundAddr = onChain ? yield call(selectReceiveAddress, BASE, networks) : undefined
      const destinationAddr = toChain
        ? yield call(selectReceiveAddress, COUNTER, networks)
        : undefined
      const order: ReturnType<typeof api.createSwapOrder> = yield call(
        api.createSwapOrder,
        direction,
        quote.quote.id,
        amount,
        ccy,
        destinationAddr,
        refundAddr
      )
      const paymentR = S.getPayment(yield select())
      const payment = paymentGetOrElse(BASE.coin, paymentR)
      if (onChain) {
        try {
          yield call(buildAndPublishPayment, payment.coin, payment, order.kind.depositAddress)
          yield call(api.updateSwapOrder, order.id, 'DEPOSIT_SENT')
        } catch (e) {
          yield call(api.updateSwapOrder, order.id, 'CANCEL')
          throw e
        }
      }
      yield put(actions.form.stopSubmit('previewSwap'))
      yield put(actions.components.refresh.refreshClicked())
      yield put(actions.form.destroy('swapAmount'))
      yield put(
        A.setStep({
          options: {
            order
          },
          step: 'SUCCESSFUL_SWAP'
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('previewSwap', { _error: error }))
    }
  }

  const fetchCustodialEligibility = function* () {
    try {
      yield put(A.fetchCustodialEligibilityLoading())
      const { eligible }: ReturnType<typeof api.checkCustodialSwapEligibility> = yield call(
        api.checkCustodialSwapEligibility
      )
      yield put(A.fetchCustodialEligibilitySuccess(eligible))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchCustodialEligibiliyFailure(error))
    }
  }

  const fetchLimits = function* () {
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

  const fetchPairs = function* () {
    try {
      yield put(A.fetchPairsLoading())
      const pairs: ReturnType<typeof api.getSwapPairs> = yield call(api.getSwapPairs)
      yield put(A.fetchPairsSuccess(pairs))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchPairsFailure(error))
    }
  }

  // 👋
  // Eventually there won't be much difference between a swap, buy, or sell.
  // We have 2 different directories (swap/simpleBuy) of sagas/actions/types
  // but on the BE there won't be any difference, just on the FE (if product)
  // decides to keep things that way. In my opinion there is no difference
  // but for now I'm copying a lot of the code from here and putting it in
  // simpleBuy.
  //
  // As of this writing, simpleBuy only fetches one quote and doesn't need
  // to worry about expiration, but since we're now using swap 2.0 for sell
  // (and eventually buy) we'll need to worry about expiration and polling.
  //
  // We can't just call the swap fetchQuote function from simpleBuy, because
  // setting the swap quote loading will set the buy/sell quote loading,
  // which we might not want. This is a case of breakdown between product/design/development.

  const fetchQuote = function* () {
    while (true) {
      try {
        yield put(A.fetchQuoteLoading())
        const initSwapFormValues = selectors.form.getFormValues('initSwap')(
          yield select()
        ) as InitSwapFormValuesType
        if (!initSwapFormValues || !initSwapFormValues.BASE || !initSwapFormValues.COUNTER) {
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
        const rate = getRate(
          quote.quote.priceTiers,
          COUNTER.coin,
          new BigNumber(convertStandardToBase(BASE.coin, 1))
        )
        yield put(A.fetchQuoteSuccess(quote, rate))
        const refresh = -moment().diff(quote.expiresAt)
        yield delay(refresh)
      } catch (e) {
        const error = errorHandler(e)
        yield put(A.fetchQuoteFailure(error))
        yield delay(FALLBACK_DELAY)
        yield put(A.startPollQuote())
      }
    }
  }

  const fetchTrades = function* () {
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

  const formChanged = function* (action) {
    if (action.meta.form !== 'swapAmount') return
    if (action.meta.field !== 'amount') return
    const initSwapFormValues = selectors.form.getFormValues('initSwap')(
      yield select()
    ) as InitSwapFormValuesType
    if (!initSwapFormValues || !initSwapFormValues.BASE) return

    const { BASE } = initSwapFormValues
    const paymentR = S.getPayment(yield select())
    const fix = S.getFix(yield select())
    const userCurrency = selectors.core.settings.getCurrency(yield select()).getOrElse('USD')
    const rates = selectors.core.data.misc
      .getRatesSelector(BASE.coin, yield select())
      .getOrFail('Failed to get rates')

    const amountFieldValue =
      fix === 'CRYPTO'
        ? action.payload
        : Exchange.convertFiatToCoin(action.payload, BASE.coin, userCurrency, rates)
    yield put(actions.form.change('swapAmount', 'cryptoAmount', amountFieldValue))

    if (BASE.type === SwapBaseCounterTypes.CUSTODIAL) return

    const swapAmountValues = selectors.form.getFormValues('swapAmount')(
      yield select()
    ) as SwapAmountFormValues
    // @ts-ignore
    let payment = paymentGetOrElse(BASE.coin, paymentR)

    try {
      const paymentAmount = generateProvisionalPaymentAmount(
        BASE.coin,
        Number(swapAmountValues?.cryptoAmount)
      )
      payment = yield payment.amount(paymentAmount)
      payment = yield payment.build()
      yield put(A.updatePaymentSuccess(payment.value()))
    } catch (error) {
      yield put(A.updatePaymentFailure(error))
    }
  }

  const initAmountForm = function* () {
    let payment: PaymentValue
    try {
      yield put(A.startPollQuote())
      yield put(A.fetchLimits())
      yield put(A.updatePaymentLoading())
      const initSwapFormValues = selectors.form.getFormValues('initSwap')(
        yield select()
      ) as InitSwapFormValuesType
      if (!initSwapFormValues || !initSwapFormValues.BASE) {
        return yield put(A.setStep({ step: 'INIT_SWAP' }))
      }

      yield race({
        failure: take(AT.FETCH_QUOTE_FAILURE),
        success: take(AT.FETCH_QUOTE_SUCCESS)
      })
      const quote = S.getQuote(yield select()).getOrFail(NO_QUOTE)

      const { BASE } = initSwapFormValues
      if (BASE.type === SwapBaseCounterTypes.ACCOUNT) {
        payment = yield call(calculateProvisionalPayment, BASE, quote.quote, 0)
        yield put(A.updatePaymentSuccess(payment))
      } else {
        yield put(A.updatePaymentSuccess(undefined))
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.updatePaymentFailure(error))
    }
  }

  const refreshAccounts = function* () {
    const initSwapFormValues = selectors.form.getFormValues('initSwap')(
      yield select()
    ) as InitSwapFormValuesType

    if (!initSwapFormValues || !initSwapFormValues.BASE || !initSwapFormValues.COUNTER) {
      return
    }

    const accounts = getCoinAccounts(yield select(), SWAP_ACCOUNTS_SELECTOR)
    const baseAccount = accounts[initSwapFormValues.BASE.coin].find(
      (val) => val.label === initSwapFormValues.BASE?.label
    )
    const counterAccount = accounts[initSwapFormValues.COUNTER.coin].find(
      (val) => val.label === initSwapFormValues.COUNTER?.label
    )

    yield put(actions.form.change('initSwap', 'BASE', baseAccount))
    yield put(actions.form.change('initSwap', 'COUNTER', counterAccount))
  }

  const showModal = function* ({ payload }: ReturnType<typeof A.showModal>) {
    const { baseCurrency, counterCurrency, origin } = payload
    yield put(
      actions.modals.showModal('SWAP_MODAL', {
        baseCurrency,
        counterCurrency,
        origin
      })
    )

    const latestPendingOrder = S.getLatestPendingSwapTrade(yield select())

    if (latestPendingOrder) {
      yield put(
        A.setStep({
          options: { order: latestPendingOrder },
          step: 'ORDER_DETAILS'
        })
      )
    } else {
      yield put(
        A.setStep({
          step: 'INIT_SWAP'
        })
      )
    }
  }

  const switchFix = function* ({ payload }: ReturnType<typeof A.switchFix>) {
    yield put(A.setCheckoutFix(payload.fix))
    const newAmount = new BigNumber(payload.amount).isGreaterThan(0) ? payload.amount : undefined
    yield put(actions.form.change('swapAmount', 'amount', newAmount))
    yield put(actions.form.focus('swapAmount', 'amount'))
  }

  const toggleBaseAndCounter = function* () {
    const initSwapFormValues = selectors.form.getFormValues('initSwap')(
      yield select()
    ) as InitSwapFormValuesType
    if (!initSwapFormValues || !initSwapFormValues.BASE || !initSwapFormValues.COUNTER) {
      return yield put(A.setStep({ step: 'INIT_SWAP' }))
    }

    const { BASE: currentBase, COUNTER: currentCounter } = initSwapFormValues

    yield put(actions.form.change('initSwap', 'BASE', currentCounter))
    yield put(actions.form.change('initSwap', 'COUNTER', currentBase))
    yield put(actions.form.clearFields('swapAmount', false, false, 'amount'))
    yield put(actions.form.change('swapAmount', 'cryptoAmount', 0))

    yield put(A.initAmountForm())
  }

  const handleSwapMaxAmountClick = function* ({
    payload
  }: ReturnType<typeof A.handleSwapMaxAmountClick>) {
    const { amount } = payload

    yield put(actions.form.change('swapAmount', 'amount', amount))
  }

  const handleSwapMinAmountClick = function* ({
    payload
  }: ReturnType<typeof A.handleSwapMinAmountClick>) {
    const { amount } = payload

    yield put(actions.form.change('swapAmount', 'amount', amount))
  }

  return {
    calculateProvisionalPayment,
    cancelOrder,
    changeBase,
    changeCounter,
    changeTrendingPair,
    createOrder,
    fetchCustodialEligibility,
    fetchLimits,
    fetchPairs,
    fetchQuote,
    fetchTrades,
    formChanged,
    handleSwapMaxAmountClick,
    handleSwapMinAmountClick,
    initAmountForm,
    refreshAccounts,
    showModal,
    switchFix,
    toggleBaseAndCounter
  }
}
