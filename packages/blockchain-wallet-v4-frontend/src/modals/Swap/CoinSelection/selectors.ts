import { uniq } from 'ramda'

import { CoinType } from '@core/types'
import { selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { getInputFromPair, getOutputFromPair } from 'data/components/swap/model'
import {
  InitSwapFormValuesType,
  SwapAccountType,
  SwapBaseCounterTypes
} from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'

export const getData = (state: RootState, { side }: OwnProps) => {
  const coins = selectors.components.swap.getCoins()
  const accounts = getCoinAccounts(state, { coins, ...SWAP_ACCOUNTS_SELECTOR })
  const pairs = selectors.components.swap.getPairs(state).getOrElse([])
  const values = selectors.form.getFormValues('initSwap')(state) as InitSwapFormValuesType
  const custodialEligibility = selectors.components.swap
    .getCustodialEligibility(state)
    .getOrElse(false)

  if (!pairs.length) return { accounts }

  const _checkBaseCustodial = (account: SwapAccountType) => {
    if (
      (side === 'COUNTER' &&
        values?.BASE?.type === SwapBaseCounterTypes.CUSTODIAL &&
        account.type === SwapBaseCounterTypes.ACCOUNT) ||
      (side === 'BASE' &&
        values?.COUNTER?.type === SwapBaseCounterTypes.ACCOUNT &&
        account.type === SwapBaseCounterTypes.CUSTODIAL)
    ) {
      return true
    }
    return false
  }

  const _checkCoinSelected = (account: SwapAccountType) => {
    if (
      (side === 'COUNTER' && values?.BASE?.coin === account.coin) ||
      (side === 'BASE' && values?.COUNTER?.coin === account.coin)
    ) {
      return true
    }
    return false
  }

  const _checkBaseAccountZero = (account: SwapAccountType) => {
    if ((account.balance === 0 || account.balance === '0') && side === 'BASE') {
      return true
    }
    return false
  }

  const _checkCustodialEligibility = (account: SwapAccountType) => {
    return !(account.type === SwapBaseCounterTypes.CUSTODIAL && !custodialEligibility)
  }

  const sideF = side === 'BASE' ? getInputFromPair : getOutputFromPair
  let coinsForSide = uniq(pairs.map(sideF))

  if (side === 'COUNTER' && values && values.BASE) {
    coinsForSide = pairs
      .filter((pair) => {
        return pair.split('-')[0] === values?.BASE?.coin
      })
      .map(sideF)
  }

  // This will only work if the coin is disabled for to and from
  const accountsForSide = coinsForSide.reduce((prevValue, curValue: CoinType) => {
    if (!prevValue[curValue]) {
      return {
        ...prevValue,
        [curValue]: accounts[curValue]
      }
    }

    return prevValue
  }, []) as unknown as { [key in CoinType]: Array<SwapAccountType> }

  let filteredAccounts = Object.keys(accountsForSide).reduce((prevValue, curValue: CoinType) => {
    return [...prevValue, ...accountsForSide[curValue]]
  }, [] as Array<SwapAccountType>)

  filteredAccounts = filteredAccounts.filter((account) => {
    const isCoinSelected = _checkCoinSelected(account)
    const hideCustodialToAccount = _checkBaseCustodial(account)
    const isBaseAccountZero = _checkBaseAccountZero(account)
    const isCustodialEligible = _checkCustodialEligibility(account)

    return !isBaseAccountZero && !isCoinSelected && !hideCustodialToAccount && isCustodialEligible
  })

  return { accounts: accountsForSide, filteredAccounts }
}
