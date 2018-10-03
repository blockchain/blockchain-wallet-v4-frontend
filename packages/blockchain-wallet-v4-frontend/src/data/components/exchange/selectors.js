import { curry, lift, path, pathOr, prop, propEq } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { coreSelectors } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

export const useShapeShift = state =>
  !selectors.modules.profile.userFlowSupported(state).getOrElse(false)

export const canUseExchange = state =>
  selectors.modules.profile.isUserActive(state) &&
  selectors.modules.profile.isUserVerified(state)

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
          const data = prop(prop('xpub', acc), bchData)
          const metadata = bchMetadata[index]

          return {
            archived: prop('archived', metadata),
            coin: 'BCH',
            label: prop('label', metadata) || prop('xpub', acc),
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
          const data = prop(prop('addr', acc), ethData)

          return {
            archived: prop('archived', acc),
            coin: 'ETH',
            label: prop('label', acc) || prop('addr', acc),
            address: prop('addr', acc),
            balance: prop('balance', data),
            type: ADDRESS_TYPES.ACCOUNT
          }
        })
        .filter(isActive)
        .concat(lockboxEthData)

    return lift(transform)(ethDataR, ethMetadataR, lockboxEthDataR)
  }
)
