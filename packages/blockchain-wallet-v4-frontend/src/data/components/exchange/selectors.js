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
  lt,
  path,
  pathOr,
  prop,
  propEq
} from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { coreSelectors } from 'blockchain-wallet-v4/src'
import { selectors, model } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import {
  getTargetCoinsPairedToSource,
  getAvailableSourceCoins,
  EXCHANGE_FORM
} from './model'

export const canUseExchange = state =>
  selectors.modules.profile
    .getUserTiers(state)
    .map(
      compose(
        lt(0),
        prop('current')
      )
    )
    .getOrElse(false)

export const getStep = path(['components', 'exchange', 'step'])
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

export const getActiveBsvAccounts = createDeepEqualSelector(
  [
    coreSelectors.wallet.getHDAccounts,
    coreSelectors.data.bsv.getAddresses,
    coreSelectors.kvStore.bsv.getAccounts
  ],
  (bsvAccounts, bsvDataR, bsvMetadataR) => {
    const transform = (bsvData, bsvMetadata) =>
      bsvAccounts
        .map(acc => {
          const index = prop('index', acc)
          const xpub = prop('xpub', acc)
          const data = prop(xpub, bsvData)
          const metadata = bsvMetadata[index]

          return {
            archived: prop('archived', metadata),
            coin: 'BSV',
            label: prop('label', metadata) || xpub,
            address: index,
            balance: prop('final_balance', data),
            type: ADDRESS_TYPES.ACCOUNT
          }
        })
        .filter(isActive)
    return lift(transform)(bsvDataR, bsvMetadataR)
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
  BSV: getActiveBsvAccounts(state).getOrElse([]),
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

const getInitialAccounts = (state, availablePairs, from, to) => {
  if (!from || !to) return {}

  const accounts = getActiveAccounts(state)
  const availableSourceCoins = getAvailableSourceCoins(availablePairs)

  const [initialSourceCoin, initialTargetCoin] = getInitialCoins(
    from,
    to,
    availablePairs,
    availableSourceCoins
  )

  return {
    source: head(accounts[initialSourceCoin]),
    target: head(accounts[initialTargetCoin])
  }
}

export const getInitialValues = (state, availablePairs, requested) => {
  const defaultValues = {
    ...getInitialAccounts(state, availablePairs, 'BTC', 'ETH'),
    sourceFiat: 0,
    fix: model.rates.FIX_TYPES.BASE_IN_FIAT
  }

  const prevValues = selectors.form.getFormValues(EXCHANGE_FORM)(state)

  const { from, to, fix, amount } = requested
  const requestedValues = getInitialAccounts(state, availablePairs, from, to)

  if (fix && amount) {
    requestedValues.fix = fix
    requestedValues[model.rates.mapFixToFieldName(fix)] = amount
  }

  return {
    ...defaultValues,
    ...prevValues,
    ...requestedValues
  }
}
