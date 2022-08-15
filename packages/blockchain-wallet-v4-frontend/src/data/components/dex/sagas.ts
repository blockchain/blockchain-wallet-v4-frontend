import { call, put, select } from 'redux-saga/effects'

import { Exchange } from '@core'
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
      const currentChain = (yield select(S.getCurrentChain)).getOrFail('unknown chain')
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

  const fetchSwapQuote = function* (action) {
    const {
      meta: { field, form }
    } = action
    // exit if incorrect form changed or the form values were modified by a saga (avoid infinite loop)
    if (form !== DEX_SWAP_FORM || action['@@redux-saga/SAGA_ACTION'] === true) return
    const state = yield select()
    const formValues = selectors.form.getFormValues(DEX_SWAP_FORM)(state) as DexSwapForm
    if (!formValues) return

    let quoteResponse
    const { baseToken, baseTokenAmount, counterToken, slippage } = formValues

    // only fetch/update swap quote if we have a valid pair and a base amount
    if (baseToken && counterToken && baseTokenAmount) {
      try {
        yield put(A.fetchSwapQuoteLoading())

        // get chain config and user settings
        const currentChain: DexChain = (yield select(
          selectors.components.dex.getCurrentChain
        )).getOrFail()
        const baseTokenInfo = (yield select(
          selectors.components.dex.getChainTokenInfo,
          baseToken
        )).getOrFail()
        const baseAmountGwei = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin: currentChain.nativeCurrency.symbol,
          value: baseTokenAmount || 0
        })
        const counterTokenInfo = (yield select(
          selectors.components.dex.getChainTokenInfo,
          counterToken
        )).getOrFail()

        quoteResponse = yield call(api.getDexSwapQuote, {
          fromCurrency: {
            address: baseTokenInfo.address,
            amount: baseAmountGwei,
            chainId: currentChain.chainId,
            symbol: baseToken
          },
          params: {
            slippage: slippage || null
          },
          toCurrency: {
            address: counterTokenInfo.address,
            chainId: currentChain.chainId,
            symbol: counterToken
          },
          venue: 'ZEROX'
        })

        // check for error
        if (quoteResponse?.code) {
          yield put(A.fetchSwapQuoteFailure(quoteResponse))
        } else {
          yield put(A.fetchSwapQuoteSuccess(quoteResponse))
        }

        // now that we have an updated quote, determine which fields we need to update
        // counterToken = quotes.buyAmount
        // baseToken = quotes.sellAmount
        const quote = quoteResponse?.quotes[quoteResponse.type === 'SINGLE' ? 0 : 1]
        if (quote) {
          switch (field) {
            case 'flipPairs':
            case 'baseTokenAmount':
              yield put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'counterTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.buyAmount.symbol,
                    value: quote.buyAmount.amount
                  })
                )
              )
              break
            case 'counterTokenAmount':
              yield put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'baseTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.sellAmount.symbol,
                    value: quote.sellAmount.amount
                  })
                )
              )
              break
            case 'baseToken':
            case 'counterToken':
              yield put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'baseTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.sellAmount.symbol,
                    value: quote.sellAmount.amount
                  })
                )
              )
              yield put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'counterTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.buyAmount.symbol,
                    value: quote.buyAmount.amount
                  })
                )
              )
              break
            default:
              break
          }
        }
      } catch (e) {
        yield put(A.fetchSwapQuoteFailure(e))
      }
    }
  }

  return {
    fetchChainTopTokens,
    fetchChains,
    fetchSwapQuote
  }
}
