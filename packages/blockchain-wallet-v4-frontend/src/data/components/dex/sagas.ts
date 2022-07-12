import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { actions, model, selectors } from 'data'

import * as S from './selectors'
import { actions as A } from './slice'
import { DexChain, DexChainList, DexChainTokenList, DexSwapForm } from './types'

const { DEX_SWAP_FORM } = model.components.dex

export default ({ api }: { api: APIType }) => {
  const fetchChains = function* () {
    try {
      yield put(A.fetchChainsLoading())
      const chainsList: DexChainList = yield call(api.getDexChains)
      yield put(A.fetchChainsSuccess(chainsList))
      // TODO: since MVP only supports ETH chain, set as current and then pre-fetch token list
      const ethChain = chainsList.find(
        (chain) => chain.nativeCurrency.name === 'Ethereum'
      ) as DexChain
      yield put(A.setCurrentChain(ethChain))
      yield put(A.fetchChainTopTokens())
    } catch (e) {
      yield put(A.fetchChainsFailure(e.toString()))
    }
  }

  const fetchChainTopTokens = function* () {
    try {
      yield put(A.fetchChainTopTokensLoading())
      const currentChain = yield select(S.getCurrentChain)
      const tokenList: DexChainTokenList = yield call(
        api.getDexChainTopTokens,
        currentChain.chainId
      )
      // append the native currency of chain to full token list
      const fullTokenList = [currentChain.nativeCurrency].concat(tokenList).filter(Boolean)
      yield put(A.fetchChainTopTokensSuccess(fullTokenList))
    } catch (e) {
      yield put(A.fetchChainTopTokensFailure(e.toString()))
    }
  }

  const formChanged = function* (action) {
    try {
      const {
        meta: { field, form }
      } = action
      if (form !== DEX_SWAP_FORM) return
      const state = yield select()
      const formValues = selectors.form.getFormValues(DEX_SWAP_FORM)(state) as DexSwapForm
      if (!formValues) return

      switch (field) {
        case 'flipPairs':
          yield put(
            actions.form.initialize(DEX_SWAP_FORM, {
              baseToken: formValues.counterToken,
              baseTokenAmount: formValues.counterTokenAmount,
              counterToken: formValues.baseToken,
              counterTokenAmount: formValues.baseTokenAmount
            })
          )
          break
        default:
          break
      }

      // only fetch/update swap quote if we have a valid pair
      if (formValues.baseToken && formValues.counterToken) {
        try {
          yield put(A.fetchSwapQuoteLoading())
          // TODO: dont hardcode
          const quoteResponse = yield call(api.getDexSwapQuote, {
            fromCurrency: {
              address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
              amount: '100000000000000000',
              chainId: 3,
              symbol: 'ETH'
            },
            params: {
              slippage: '0.03'
            },
            toCurrency: {
              address: '0xad6d458402f60fd3bd25163575031acdce07538d',
              chainId: 3,
              symbol: 'DAI'
            },
            venue: 'ZEROX'
          })

          // check for error
          if (quoteResponse?.code) {
            yield put(A.fetchSwapQuoteFailure(quoteResponse))
          } else {
            yield put(A.fetchSwapQuoteSuccess(quoteResponse))
          }
        } catch (e) {
          yield put(A.fetchSwapQuoteFailure(e.toString()))
        }
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log(e)
    }
  }

  return {
    fetchChainTopTokens,
    fetchChains,
    formChanged
  }
}
