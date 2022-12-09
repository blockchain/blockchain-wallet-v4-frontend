import { call, put, select } from 'typed-redux-saga'

import { Exchange, Remote } from '@core'
import { APIType } from '@core/network/api'
import { actions, model, selectors } from 'data'

import { actions as A } from './slice'
import type { DexSwapForm } from './types'

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

      const walletAddress = nonCustodialCoinAccounts[token][0].address
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
        yield* put(A.fetchChainAllTokensFailure('Failed to get Ethereum chain'))
        return
      }

      yield* put(A.setCurrentChain(ethChain))
      yield* put(A.fetchChainAllTokens())
    } catch (e) {
      yield* put(A.fetchChainsFailure(e.toString()))
    }
  }

  const fetchChainAllTokens = function* () {
    try {
      yield* put(A.fetchChainAllTokensLoading())
      const currentChain = selectors.components.dex
        .getCurrentChain(yield* select())
        .getOrFail('Unable to get current chain')
      const tokenList = yield* call(api.getDexChainAllTokens, currentChain.chainId)
      const tokenListWithNative = [currentChain.nativeCurrency, ...tokenList]
      yield* put(A.fetchChainAllTokensSuccess(tokenListWithNative))
    } catch (e) {
      yield* put(A.fetchChainAllTokensFailure(e.toString()))
    }
  }

  const fetchSwapQuote = function* (action) {
    const {
      meta: { field, form }
    } = action
    // exit if incorrect form changed or the form values were modified by a saga (avoid infinite loop)
    if (form !== DEX_SWAP_FORM || action['@@redux-saga/SAGA_ACTION'] === true) return
    const state = yield* select()
    const formValues = selectors.form.getFormValues(DEX_SWAP_FORM)(state) as DexSwapForm
    if (!formValues) return

    let quoteResponse
    const { baseToken, baseTokenAmount, counterToken, slippage } = formValues

    // only fetch/update swap quote if we have a valid pair and a base amount
    if (baseToken && counterToken && baseTokenAmount && parseFloat(`${baseTokenAmount}`)) {
      try {
        yield* put(A.fetchSwapQuoteLoading())

        const currentChain = selectors.components.dex
          .getCurrentChain(yield* select())
          .getOrFail('Unable to get current chain')

        const baseTokenInfo = selectors.components.dex
          .getChainTokenInfo(yield* select(), baseToken)
          .getOrFail('Unable to get base token info')

        if (!baseTokenInfo) {
          return Remote.Failure('No base token')
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
          return Remote.Failure('No counter token')
        }

        const nonCustodialCoinAccounts = yield* select(() =>
          selectors.coins.getCoinAccounts(state, {
            coins: [baseToken],
            nonCustodialAccounts: true
          })
        )

        const nonCustodialAddress = nonCustodialCoinAccounts[baseToken][0].address
        if (!nonCustodialAddress) {
          return Remote.Failure('No user wallet address')
        }

        quoteResponse = yield* call(
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

        // check for error
        if (quoteResponse?.code) {
          yield* put(A.fetchSwapQuoteFailure(quoteResponse))
        } else {
          yield* put(A.fetchSwapQuoteSuccess(quoteResponse))
        }

        // We have a list of quotes but it's valid only for cross chains transactions that we currently don't have
        // Also we consider to return to the FE only one quote in that case
        const quote = quoteResponse?.quotes_?.[0]

        if (quote) {
          switch (field) {
            case 'flipPairs':
              yield* put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'counterTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.buyAmount_.symbol_,
                    value: quote.buyAmount_.amount_
                  })
                )
              )
              break

            case 'baseTokenAmount':
              yield* put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'counterTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.buyAmount_.symbol_,
                    value: quote.buyAmount_.amount_
                  })
                )
              )
              break

            case 'counterTokenAmount':
              yield* put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'baseTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.sellAmount_.symbol_,
                    value: quote.sellAmount_.amount_
                  })
                )
              )
              break

            case 'baseToken':
              yield* put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'baseTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.sellAmount_.symbol_,
                    value: quote.sellAmount_.amount_
                  })
                )
              )
              yield* put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'counterTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.buyAmount_.symbol_,
                    value: quote.buyAmount_.amount_
                  })
                )
              )
              break

            case 'counterToken':
              yield* put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'baseTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.sellAmount_.symbol_,
                    value: quote.sellAmount_.amount_
                  })
                )
              )
              yield* put(
                actions.form.change(
                  DEX_SWAP_FORM,
                  'counterTokenAmount',
                  Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: quote.buyAmount_.symbol_,
                    value: quote.buyAmount_.amount_
                  })
                )
              )
              break

            default:
              break
          }
        }
      } catch (e) {
        yield* put(A.fetchSwapQuoteFailure(e))
      }
    }
  }

  return {
    fetchChainAllTokens,
    fetchChains,
    fetchSwapQuote,
    fetchUserEligibility
  }
}
