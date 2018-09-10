import { selectors, model } from 'data'
import {
  compose,
  cond,
  curry,
  equals,
  filter,
  flip,
  head,
  indexOf,
  last,
  length,
  lift,
  map,
  path,
  prop,
  propEq,
  split,
  sortBy,
  uniq,
  unnest
} from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const { SHAPESHIFT_PAIRS, SHAPESHIFT_FORM } = model.components.exchange

const currenciesOrder = ['BTC', 'BCH', 'ETH']

const getAvailableCurrencies = chooseCurrency =>
  compose(
    sortBy(flip(indexOf)(currenciesOrder)),
    uniq,
    map(
      compose(
        chooseCurrency,
        split('-')
      )
    )
  )
const getFromCurrencies = getAvailableCurrencies(head)
const getToCurrencies = getAvailableCurrencies(last)

const getBtcGroup = btcAccounts => ({
  label: 'Bitcoin',
  options: btcAccounts.map(formatGroup)
})
const getBchGroup = bchAccounts => ({
  label: 'Bitcoin Cash',
  options: bchAccounts.map(formatGroup)
})
const getEthGroup = ethAccounts => ({
  label: 'Ether',
  options: ethAccounts.map(formatGroup)
})

export const format = acc => ({ text: prop('label', acc), value: acc })
export const formatGroup = acc => ({ label: prop('label', acc), value: acc })

export const formatDefault = curry((coin, acc) => ({ text: coin, value: acc }))

export const generateGroups = (
  bchAccounts,
  btcAccounts,
  ethAccounts,
  hasOneAccount
) => availableCurrencies => {
  if (hasOneAccount) {
    const accounts = availableCurrencies.map(
      cond([
        [equals('BTC'), () => btcAccounts.map(formatDefault('Bitcoin'))],
        [equals('BCH'), () => bchAccounts.map(formatDefault('Bitcoin Cash'))],
        [equals('ETH'), () => ethAccounts.map(formatDefault('Ether'))]
      ])
    )
    return [
      {
        group: '',
        items: unnest(accounts)
      }
    ]
  }

  return availableCurrencies.map(
    cond([
      [equals('BTC'), () => getBtcGroup(btcAccounts)],
      [equals('BCH'), () => getBchGroup(bchAccounts)],
      [equals('ETH'), () => getEthGroup(ethAccounts)]
    ])
  )
}

export const getData = createDeepEqualSelector(
  [
    selectors.components.exchange.getBtcAccounts,
    selectors.components.exchange.getBchAccounts,
    selectors.components.exchange.getEthAccounts,
    selectors.core.settings.getCurrency,
    selectors.components.exchange.getFirstStepEnabled,
    selectors.components.exchange.getError,
    selectors.form.getFormValues(SHAPESHIFT_FORM)
  ],
  (
    btcAccountsR,
    bchAccountsR,
    ethAccountsR,
    currencyR,
    enabled,
    formError,
    formValues
  ) => {
    const sourceCoin = path(['source', 'coin'], formValues) || 'BTC'
    const targetCoin = path(['target', 'coin'], formValues) || 'ETH'

    const transform = (
      btcAccounts,
      bchAccounts,
      ethAccounts,
      currency,
      availablePairs
    ) => {
      const isActive = propEq('archived', false)
      const activeBtcAccounts = filter(isActive, btcAccounts)
      const activeBchAccounts = filter(isActive, bchAccounts)
      const activeEthAccounts = filter(isActive, ethAccounts)
      const defaultBtcAccount = head(activeBtcAccounts)
      const defaultEthAccount = head(activeEthAccounts)
      const hasOneAccount = length(activeBtcAccounts) === 1
      const generateActiveGroups = generateGroups(
        activeBchAccounts,
        activeBtcAccounts,
        activeEthAccounts,
        hasOneAccount
      )
      const fromElements = generateActiveGroups(
        getFromCurrencies(availablePairs)
      )
      const toElements = generateActiveGroups(getToCurrencies(availablePairs))
      const initialValues = {
        source: defaultBtcAccount,
        target: defaultEthAccount
      }

      return {
        availablePairs,
        fromElements,
        toElements,
        initialValues,
        hasOneAccount,
        disabled: !enabled,
        formError,
        currency,
        sourceCoin,
        targetCoin
      }
    }
    return lift(transform)(
      btcAccountsR,
      bchAccountsR,
      ethAccountsR,
      currencyR,
      SHAPESHIFT_PAIRS
    )
  }
)
