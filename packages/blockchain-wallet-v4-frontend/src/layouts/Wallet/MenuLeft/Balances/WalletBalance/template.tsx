import React from 'react'

import { Wrapper } from 'components/Balances'

import { BalancesWrapper } from '../model'
import Balance from './Balance'
import PendingSBTransactions from './PendingSBTransactions'

const Template = (props) => {
  const { coins } = props

  return (
    <Wrapper>
      <PendingSBTransactions />
      <BalancesWrapper className={props.isActive ? 'active' : ''}>
        {coins.map(
          (coin) => (
            <Balance coin={coin.symbol} coinTicker={coin.symbol} key={coin.symbol} />
          ),
          coins
        )}
      </BalancesWrapper>
    </Wrapper>
  )
}

export default Template
