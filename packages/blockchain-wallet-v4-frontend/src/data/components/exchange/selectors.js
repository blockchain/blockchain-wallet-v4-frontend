import { curry, lift, path, pathOr, prop, propEq } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { coreSelectors } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const useShapeShift = state =>
  !selectors.modules.profile.userFlowSupported(state).getOrElse(false)

export const canUseExchange = state =>
  selectors.modules.profile.isUserActive(state)

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

const advicePath = pathOr(0)
const adviceToAmount = advice => ({
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
    coreSelectors.kvStore.bch.getAccounts
  ],
  (bchAccounts, bchDataR, bchMetadataR) => {
    const transform = (bchData, bchMetadata) =>
      bchAccounts
        .map(acc => {
          const index = prop('index', acc)
          const data = prop(prop('xpub', acc), bchData)
          const metadata = bchMetadata[index]

          return {
            archived: prop('archived', metadata),
            coin: 'BCH',
            label: prop('label', metadata) || prop('xpub', acc),
            address: index,
            balance: prop('final_balance', data)
          }
        })
        .filter(isActive)

    return lift(transform)(bchDataR, bchMetadataR)
  }
)

export const getActiveBtcAccounts = createDeepEqualSelector(
  [coreSelectors.wallet.getHDAccounts, coreSelectors.data.bitcoin.getAddresses],
  (btcAccounts, btcDataR) => {
    const transform = btcData => {
      return btcAccounts
        .map(acc => ({
          archived: prop('archived', acc),
          coin: 'BTC',
          label: prop('label', acc) || prop('xpub', acc),
          address: prop('index', acc),
          balance: prop('final_balance', prop(prop('xpub', acc), btcData))
        }))
        .filter(isActive)
    }

    return lift(transform)(btcDataR)
  }
)

export const getActiveEthAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.ethereum.getAddresses,
    coreSelectors.kvStore.ethereum.getAccounts
  ],
  (ethDataR, ethMetadataR) => {
    const transform = (ethData, ethMetadata) =>
      ethMetadata
        .map(acc => {
          const data = prop(prop('addr', acc), ethData)

          return {
            archived: prop('archived', acc),
            coin: 'ETH',
            label: prop('label', acc) || prop('addr', acc),
            address: prop('addr', acc),
            balance: prop('balance', data)
          }
        })
        .filter(isActive)

    return lift(transform)(ethDataR, ethMetadataR)
  }
)
