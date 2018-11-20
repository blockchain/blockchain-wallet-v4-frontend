import {
  all,
  compose,
  contains,
  curry,
  defaultTo,
  filter,
  head,
  last,
  lift,
  path,
  pathOr,
  prop,
  propEq
} from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { coreSelectors } from 'blockchain-wallet-v4/src'
import { selectors, model } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { getTargetCoinsPairedToSource, getAvailableSourceCoins } from './model'

export const useShapeShift = state =>
  !selectors.modules.profile.userFlowSupported(state).getOrElse(true)

export const canUseExchange = state =>
  selectors.modules.profile.isUserActive(state).getOrElse(false) &&
  selectors.modules.profile.isUserVerified(state).getOrElse(false)

export const getStep = path(['components', 'exchange', 'step'])
export const getPayment = path(['components', 'exchange', 'payment'])
export const getOrder = path(['components', 'exchange', 'order'])
export const getError = path(['components', 'exchange', 'error'])
export const getFirstStepEnabled = path([
  'components',
  'exchange',
  'firstStepEnabled'
])
export const getSecondStep = path(['components', 'exchange', 'secondStep'])
export const getThirdStep = path(['components', 'exchange', 'thirdStep'])
export const getLimits = path(['components', 'exchange', 'limits'])
export const getMin = path(['components', 'exchange', 'min'])
export const getMax = path(['components', 'exchange', 'max'])
export const getTargetFee = path(['components', 'exchange', 'targetFee'])
export const getSourceFee = path(['components', 'exchange', 'sourceFee'])
export const showError = path(['components', 'exchange', 'showError'])
export const getTxError = path(['components', 'exchange', 'txError'])

const advicePath = pathOr(0)
export const adviceToAmount = advice => ({
  sourceAmount: advicePath(['base', 'crypto', 'value'], advice),
  targetAmount: advicePath(['counter', 'crypto', 'value'], advice),
  sourceFiat: advicePath(['base', 'fiat', 'value'], advice),
  targetFiat: advicePath(['counter', 'fiat', 'value'], advice)
})
export const getAmounts = curry((pair, state) =>
  selectors.modules.rates.getPairAdvice(pair, state).map(adviceToAmount)
)

const adviceToRate = advice => ({
  sourceToTargetRate: advicePath(['baseToCounterRate'], advice),
  targetToSourceRate: advicePath(['counterToBaseRate'], advice),
  sourceToFiatRate: advicePath(['baseToFiatRate'], advice),
  targetToFiatRate: advicePath(['counterToFiatRate'], advice)
})
export const getRates = curry((pair, state) =>
  selectors.modules.rates.getPairAdvice(pair, state).map(adviceToRate)
)

const isActive = propEq('archived', false)

export const getActiveBchAccounts = createDeepEqualSelector(
  [
    coreSelectors.wallet.getHDAccounts,
    coreSelectors.data.bch.getAddresses,
    coreSelectors.kvStore.bch.getAccounts,
    coreSelectors.common.bch.getLockboxBchBalances
  ],
  (bchAccounts, bchDataR, bchMetadataR, lockboxBchAccountsR) => {
    const transform = (bchData, bchMetadata, lockboxBchAccounts) =>
      bchAccounts
        .map(acc => {
          const index = prop('index', acc)
          const xpub = prop('xpub', acc)
          const data = prop(xpub, bchData)
          const metadata = bchMetadata[index]

          return {
            archived: prop('archived', metadata),
            coin: 'BCH',
            label: prop('label', metadata) || xpub,
            address: index,
            balance: prop('final_balance', data),
            type: ADDRESS_TYPES.ACCOUNT
          }
        })
        .filter(isActive)
        .concat(lockboxBchAccounts)
    return lift(transform)(bchDataR, bchMetadataR, lockboxBchAccountsR)
  }
)

export const getActiveBtcAccounts = createDeepEqualSelector(
  [
    coreSelectors.wallet.getHDAccounts,
    coreSelectors.data.bitcoin.getAddresses,
    coreSelectors.common.btc.getLockboxBtcBalances
  ],
  (btcAccounts, btcDataR, lockboxBtcAccountsR) => {
    const transform = (btcData, lockboxBtcAccounts) => {
      return btcAccounts
        .map(acc => ({
          archived: prop('archived', acc),
          coin: 'BTC',
          label: prop('label', acc) || prop('xpub', acc),
          address: prop('index', acc),
          balance: prop('final_balance', prop(prop('xpub', acc), btcData)),
          type: ADDRESS_TYPES.ACCOUNT
        }))
        .filter(isActive)
        .concat(lockboxBtcAccounts)
    }

    return lift(transform)(btcDataR, lockboxBtcAccountsR)
  }
)

export const getActiveEthAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.ethereum.getAddresses,
    coreSelectors.kvStore.ethereum.getAccounts,
    coreSelectors.common.eth.getLockboxEthBalances
  ],
  (ethDataR, ethMetadataR, lockboxEthDataR) => {
    const transform = (ethData, ethMetadata, lockboxEthData) =>
      ethMetadata
        .map(acc => {
          const address = prop('addr', acc)
          const data = prop(address, ethData)

          return {
            archived: prop('archived', acc),
            coin: 'ETH',
            label: prop('label', acc) || address,
            address,
            balance: prop('balance', data),
            type: ADDRESS_TYPES.ACCOUNT
          }
        })
        .filter(isActive)
        .concat(lockboxEthData)

    return lift(transform)(ethDataR, ethMetadataR, lockboxEthDataR)
  }
)

export const getActiveXlmAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.xlm.getAccounts,
    coreSelectors.kvStore.xlm.getAccounts,
    coreSelectors.common.xlm.getLockboxXlmBalances
  ],
  (xlmData, xlmMetadataR, lockboxXlmDataR) => {
    const transform = (xlmMetadata, lockboxXlmData) =>
      xlmMetadata
        .map(acc => {
          const address = prop('publicKey', acc)
          const account = prop(address, xlmData)
          const noAccount = path(['error', 'message'], account) === 'Not Found'
          const balance = account
            .map(coreSelectors.data.xlm.selectBalanceFromAccount)
            .getOrElse(0)
          return {
            archived: prop('archived', acc),
            coin: 'XLM',
            label: prop('label', acc) || address,
            address,
            balance,
            noAccount,
            type: ADDRESS_TYPES.ACCOUNT
          }
        })
        .filter(isActive)
        .concat(lockboxXlmData)

    return lift(transform)(xlmMetadataR, lockboxXlmDataR)
  }
)

export const getActiveAccounts = state => ({
  BTC: getActiveBtcAccounts(state).getOrElse([]),
  BCH: getActiveBchAccounts(state).getOrElse([]),
  ETH: getActiveEthAccounts(state).getOrElse([]),
  XLM: getActiveXlmAccounts(state).getOrElse([])
})

export const getAvailablePairs = state => {
  const activeAccounts = getActiveAccounts(state)
  const pairsR = selectors.modules.rates.getAvailablePairs(state)
  return pairsR.map(
    filter(
      compose(
        all(currency => path([currency, 'length'], activeAccounts) > 0),
        model.rates.splitPair
      )
    )
  )
}

const getInitialCoins = (
  requestedSourceCoin,
  requestedTargetCoin,
  availablePairs,
  availableSourceCoins
) => {
  const requestedPair = model.rates.formatPair(
    requestedSourceCoin,
    requestedTargetCoin
  )
  if (contains(requestedPair, availablePairs))
    return [requestedSourceCoin, requestedTargetCoin]

  const initialSourceCoin = defaultTo(
    requestedSourceCoin,
    head(availableSourceCoins)
  )
  const initialTargetCoin = compose(
    defaultTo(requestedTargetCoin),
    last,
    getTargetCoinsPairedToSource
  )(initialSourceCoin, availablePairs)

  return [initialSourceCoin, initialTargetCoin]
}

export const getInitialValues = (
  state,
  requestedFrom,
  requestedTo,
  availablePairs
) => {
  const accounts = getActiveAccounts(state)
  const availableSourceCoins = getAvailableSourceCoins(availablePairs)

  const [initialSourceCoin, initialTargetCoin] = getInitialCoins(
    requestedFrom,
    requestedTo,
    availablePairs,
    availableSourceCoins
  )

  const initialSourceAccount = head(accounts[initialSourceCoin])
  const initialTargetAccount = head(accounts[initialTargetCoin])

  return {
    source: initialSourceAccount,
    target: initialTargetAccount,
    sourceFiat: 0,
    fix: model.rates.FIX_TYPES.BASE_IN_FIAT
  }
}
