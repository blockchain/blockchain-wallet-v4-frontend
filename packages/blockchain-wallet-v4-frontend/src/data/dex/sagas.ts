import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'

import * as S from './selectors'
import { actions as A } from './slice'
import { DexChain, DexChainList, DexChainTokenList } from './types'

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

  return {
    fetchChainTopTokens,
    fetchChains
  }
}
