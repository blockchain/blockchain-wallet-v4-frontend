import { call, put, select } from 'redux-saga/effects'

import * as A from './actions'
import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { getRate } from './utils'
import { InitSwapFormValuesType } from './types'
import BigNumber from 'bignumber.js'

export default ({ api }: { api: APIType }) => {
  const changePair = function * ({ payload }: ReturnType<typeof A.changePair>) {
    yield put(actions.form.change('initSwap', payload.side, payload.account))
    yield put(A.setStep({ step: 'INIT_SWAP' }))
  }

  const fetchQuote = function * () {
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
      const pair = `${initSwapFormValues.BASE.coin}-${initSwapFormValues.COUNTER.coin}`
      const quote: ReturnType<typeof api.getSwapQuote> = yield call(
        api.getSwapQuote,
        pair,
        'ON_CHAIN'
      )
      const rate = getRate(quote.quote.priceTiers, new BigNumber(1))
      yield put(A.fetchQuoteSuccess(quote, rate))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchQuoteFailure(error))
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
    fetchQuote,
    showModal
  }
}
