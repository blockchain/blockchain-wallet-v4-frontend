import React from 'react'
import { useSelector } from 'react-redux'

import { Wrapper } from 'components/Balances'
import { selectors } from 'data'

import { BalancesWrapper } from '../model'
import Balance from './Balance'
import PendingBSTransactions from './PendingBSTransactions'

const WalletBalance = () => {
  const coins = useSelector(selectors.balances.getTotalWalletBalancesSorted).getOrElse([])
  const isActive = useSelector(selectors.preferences.getTotalBalancesDropdown)?.wallet

  return (
    <Wrapper>
      <PendingBSTransactions />
      <BalancesWrapper className={isActive ? 'active' : ''}>
        {coins.map((coin) => (
          <Balance coin={coin.symbol} coinTicker={coin.symbol} key={coin.symbol} />
        ))}
      </BalancesWrapper>
    </Wrapper>
  )
}

export default WalletBalance
