import React from 'react'

import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Amount } from './CoinWithBalance.model'

const CoinBalanceDisplay = ({ balance, coin }: { balance: number | string; coin: string }) => {
  return (
    <Amount>
      <FiatDisplay
        coin={coin}
        size='16px'
        mobileSize='16px'
        loadingHeight='20px'
        color='grey800'
        cursor='inherit'
        weight={500}
        data-e2e={`${coin}FiatBalance`}
      >
        {balance}
      </FiatDisplay>
      <CoinDisplay
        coin={coin}
        size='12px'
        mobileSize='12px'
        color='grey600'
        cursor='inherit'
        weight={500}
        data-e2e={`${coin}Balance`}
      >
        {balance}
      </CoinDisplay>
    </Amount>
  )
}

export default CoinBalanceDisplay
