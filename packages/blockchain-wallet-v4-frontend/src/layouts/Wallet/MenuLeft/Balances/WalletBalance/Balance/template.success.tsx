import React from 'react'

import { CoinBalanceWrapper } from '../../model'
import { Props as OwnProps } from '.'

const Success = ({ balance, coin, coinTicker, large }: Props) => {
  return (
    <div data-e2e={`balanceDropdown-wallet-${coin}`}>
      <CoinBalanceWrapper balance={balance} coin={coin} coinTicker={coinTicker} large={large} />
    </div>
  )
}

export type Props = OwnProps & { balance: number }

export default Success
