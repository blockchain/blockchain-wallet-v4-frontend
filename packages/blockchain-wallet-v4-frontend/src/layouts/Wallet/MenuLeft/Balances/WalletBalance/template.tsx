import React from 'react'
import { mapObjIndexed, values } from 'ramda'

import { SupportedWalletCurrencyType } from 'blockchain-wallet-v4/src/types'
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
        {values(
          mapObjIndexed(
            (coin: SupportedWalletCurrencyType) => (
              <Balance
                coin={coin.coinfig.symbol}
                coinTicker={coin.coinfig.symbol}
                key={coin.coinfig.symbol}
              />
            ),
            coins
          )
        )}
      </BalancesWrapper>
    </Wrapper>
  )
}

export default Template
