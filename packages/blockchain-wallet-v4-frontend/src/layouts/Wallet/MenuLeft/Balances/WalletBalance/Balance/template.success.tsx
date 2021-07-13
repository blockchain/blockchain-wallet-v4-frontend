import React from 'react'

import { CoinBalanceWrapper } from '../../model'
import { Props as OwnProps, SuccessStateType } from '.'

const Success = (props: Props) => {
  const { balance, coin, coinTicker, large } = props

  return (
    <div data-e2e={`balanceDropdown-wallet-${coin}`}>
      <CoinBalanceWrapper
        {...props}
        coin={coin}
        balance={balance}
        large={large}
        coinTicker={coinTicker}
      />
    </div>
  )
}

export type Props = OwnProps & SuccessStateType & { balance: number }

export default Success
