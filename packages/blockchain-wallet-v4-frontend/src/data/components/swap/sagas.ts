import { call, delay, put, select } from 'redux-saga/effects'

import * as A from './actions'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import { convertStandardToBase } from '../exchange/services'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { getDirection, getPair, getRate } from './utils'
import { InitSwapFormValuesType, SwapAmountFormValues } from './types'
import BigNumber from 'bignumber.js'

const DELAY = 60_000 * 2

export default ({ api }: { api: APIType }) => {
  const changePair = function * ({ payload }: ReturnType<typeof A.changePair>) {
    yield put(actions.form.change('initSwap', payload.side, payload.account))
    yield put(A.setStep({ step: 'INIT_SWAP' }))
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
      yield put(actions.form.stopSubmit('previewSwap'))
      // eslint-disable-next-line
      console.log(order)
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('previewSwap', { _error: error }))
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

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin, baseCurrency, counterCurrency } = payload
    yield put(
      actions.modals.showModal('SWAP_MODAL', {
        origin,
        baseCurrency,
        counterCurrency
      })
    )
  }

  return {
    changePair,
    createOrder,
    fetchQuote,
    showModal
  }
}
