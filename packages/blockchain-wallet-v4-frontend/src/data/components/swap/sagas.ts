import { call, put } from 'redux-saga/effects'

import * as A from './actions'
import { actions } from 'data'
import { APIType } from 'core/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'

export default ({ api }: { api: APIType }) => {
  const changePair = function * ({ payload }: ReturnType<typeof A.changePair>) {
    yield put(actions.form.change('initSwap', payload.side, payload.account))
    yield put(A.setStep({ step: 'INIT_SWAP' }))
  }

  const fetchQuote = function * () {
    try {
      yield put(A.fetchQuoteLoading())
      const pair = 'BTC-ETH'
      const quote: ReturnType<typeof api.getSwapQuote> = yield call(
        api.getSwapQuote,
        pair,
        'ON_CHAIN'
      )
      // const price = getRate(quote.quote.priceTiers, new BigNumber(1))
      yield put(A.fetchQuoteSuccess(quote))
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
