import { call, cancelled, put, select } from 'typed-redux-saga'

import { Exchange } from '@core'
import { APIType } from '@core/network/api'
import type { DexToken } from '@core/network/api/dex'
import { cancelRequestSource } from '@core/network/utils'
import { actions, model, selectors } from 'data'
import { notReachable } from 'utils/helpers'

import { actions as A } from './slice'
import type { DexSwapForm } from './types'
import { getValidSwapAmount } from './utils'

const { DEX_SWAP_FORM } = model.components.dex

export default ({ api }: { api: APIType }) => {
  const fetchUserEligibility = function* () {
    try {
      // TODO: since MVP only supports ETH chain
      const token = 'ETH'
      const state = yield* select()

      const nonCustodialCoinAccounts = yield* select(() =>
        selectors.coins.getCoinAccounts(state, {
          coins: [token],
          nonCustodialAccounts: true
        })
      )

      const walletAddress = nonCustodialCoinAccounts[token]?.[0].address
      if (!walletAddress) {
        yield* put(A.fetchUserEligibilityFailure('No user wallet address'))
      }

      yield put(A.fetchUserEligibilityLoading())
      const userEligibility = yield* call(api.getDexUserEligibility, {
        walletAddress: `${walletAddress}`
      })
      yield* put(A.fetchUserEligibilitySuccess(userEligibility))
    } catch (e) {
      yield* put(A.fetchUserEligibilityFailure(e.toString()))
    }
  }

  const fetchChains = function* () {
    try {
      yield* put(A.fetchChainsLoading())
      const chainsList = yield* call(api.getDexChains)
      yield* put(A.fetchChainsSuccess(chainsList))

      // since MVP only supports ETH chain, set as current and then pre-fetch token list
      const ethChain = chainsList.find((chain) => chain.nativeCurrency.name === 'Ethereum')
      if (!ethChain) {
        yield* put(A.fetchChainTokensFailure('Failed to get Ethereum chain'))
        return
      }

      yield* put(A.setCurrentChain(ethChain))
      yield* put(A.fetchChainTokens({ search: '', type: 'RELOAD' }))
    } catch (e) {
      yield* put(A.fetchChainsFailure(e.toString()))
    }
  }

  const fetchChainTokens = function* (action: ReturnType<typeof A.fetchChainTokens>) {
    const cancelSource = cancelRequestSource()
    try {
      yield* put(A.fetchChainTokensLoading())
      const currentTokensMeta = selectors.components.dex.getCurrentChainTokensMeta(yield* select())

      const currentChain = selectors.components.dex
        .getCurrentChain(yield* select())
        .getOrFail('Unable to get current chain')

      let tokenList: DexToken[] = []
      switch (action.payload.type) {
        case 'RELOAD':
          tokenList = yield* call(api.getDexChainTokens, currentChain.chainId, {
            cancelToken: cancelSource.token,
            offset: 0,
            search: action.payload.search
          })
          yield* put(
            A.fetchChainTokensSuccess({
              data: tokenList,
              type: 'RELOAD'
            })
          )
          break
        case 'LOAD_MORE':
          tokenList = yield* call(api.getDexChainTokens, currentChain.chainId, {
            cancelToken: undefined,
            offset: currentTokensMeta.count,
            search: action.payload.search
          })
          yield* put(
            A.fetchChainTokensSuccess({
              data: tokenList,
              type: 'LOAD_MORE'
            })
          )
          break
        default:
          notReachable(action.payload.type)
      }
    } catch (e) {
      yield* put(A.fetchChainTokensFailure(e.toString()))
    } finally {
      if (yield* cancelled()) {
        yield* call(cancelSource.cancel)
      }
    }
  }

  const fetchSwapQuote = function* (action) {
    const {
      meta: { field, form }
    } = action
    // exit if incorrect form changed or the form values were modified by a saga (avoid infinite loop)
    if (form !== DEX_SWAP_FORM || action['@@redux-saga/SAGA_ACTION'] === true) return
    const formValues = selectors.form.getFormValues(DEX_SWAP_FORM)(yield* select()) as DexSwapForm

    // do not request quote on automatic form flip
    if (!formValues) return
    if (formValues.isFlipping) return
    if (formValues.baseToken === formValues.counterToken) return

    // if one of the values is 0 set another one to 0 and clear a quote
    if (field === 'baseTokenAmount' && getValidSwapAmount(formValues.baseTokenAmount) === 0) {
      yield* put(actions.form.change(DEX_SWAP_FORM, 'counterTokenAmount', ''))
      yield* put(A.clearCurrentSwapQuote())
      return
    }
    if (field === 'counterTokenAmount' && getValidSwapAmount(formValues.counterTokenAmount) === 0) {
      yield* put(actions.form.change(DEX_SWAP_FORM, 'baseTokenAmount', ''))
      yield* put(A.clearCurrentSwapQuote())
      return
    }

    const { baseToken, baseTokenAmount, counterToken, counterTokenAmount, slippage } = formValues

    // only fetch/update swap quote if we have a valid pair and a base amount
    if (
      baseToken &&
      counterToken &&
      (getValidSwapAmount(baseTokenAmount) || getValidSwapAmount(counterTokenAmount))
    ) {
      try {
        yield* put(A.fetchSwapQuoteLoading())

        const currentChain = selectors.components.dex
          .getCurrentChain(yield* select())
          .getOrFail('Unable to get current chain')

        const baseTokenInfo = selectors.components.dex
          .getChainTokenInfo(yield* select(), baseToken)
          .getOrFail('Unable to get base token info')

        if (!baseTokenInfo) {
          yield* put(A.fetchSwapQuoteFailure('No base token'))
          return
        }

        const baseAmountGwei = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin: currentChain.nativeCurrency.symbol,
          value: baseTokenAmount || 0
        })

        const counterTokenInfo = selectors.components.dex
          .getChainTokenInfo(yield* select(), counterToken)
          .getOrFail('Unable to get counter token info')

        if (!counterTokenInfo) {
          yield* put(A.fetchSwapQuoteFailure('No counter token'))
          return
        }

        const nonCustodialCoinAccounts = selectors.coins.getCoinAccounts(yield* select(), {
          coins: [baseToken],
          nonCustodialAccounts: true
        })

        const nonCustodialAddress = nonCustodialCoinAccounts[baseToken][0].address
        if (!nonCustodialAddress) {
          yield* put(A.fetchSwapQuoteFailure('No user wallet address'))
          return
        }

        const quoteResponse = yield* call(
          api.getDexSwapQuote,
          {
            fromCurrency: {
              address: baseTokenInfo.address,
              amount: baseAmountGwei,
              chainId: currentChain.chainId,
              symbol: baseToken
            },
            params: {
              slippage: `${slippage}`
            },

            // User always has a private wallet setup automatically on sign up but should go through a security phrase
            // in order to receive funds. If he didn't do it he has 0 balance and just nothing to swap. We don't need
            // any additional checks here to make sure user can use a wallet
            // TODO: Pass selected wallet not the first one when we have more than 1 wallet
            takerAddress: `${nonCustodialAddress}`,

            toCurrency: {
              address: counterTokenInfo.address,
              chainId: currentChain.chainId,
              symbol: counterToken
            },

            // Hardcoded now. In future get it from: https://{{dex_url}}/v1/venues
            venue: 'ZEROX' as const
          },
          {
            ccy: 'ETH'
          }
        )

        yield* put(A.fetchSwapQuoteSuccess(quoteResponse))

        // We have a list of quotes but it's valid only for cross chains transactions that we currently don't have
        // Also we consider to return to the FE only one quote in that case
        const { quote } = quoteResponse

        if (quote) {
          yield* put(
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
          yield* put(
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
        }
      } catch (e) {
        yield* put(A.fetchSwapQuoteFailure(e))
      }
    }
  }

  return {
    fetchChainTokens,
    fetchChains,
    fetchSwapQuote,
    fetchUserEligibility
  }
}
