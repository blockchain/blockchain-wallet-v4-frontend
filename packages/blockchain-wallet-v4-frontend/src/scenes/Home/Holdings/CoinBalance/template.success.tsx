import React from 'react'

import { WalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

const Success = (props: {
  balance: number | string
  coin: WalletCurrencyType
}) => {
  const { balance, coin } = props

  return (
    <>
      <FiatDisplay
        coin={coin}
        size='16px'
        cursor='pointer'
        mobileSize='16px'
        loadingHeight='20px'
        color='grey800'
        weight={500}
        data-e2e={coin + 'FiatBalance'}
      >
        {balance}
      </FiatDisplay>
      <CoinDisplay
        coin={coin}
        size='12px'
        cursor='pointer'
        mobileSize='12px'
        color='grey400'
        weight={500}
        data-e2e={coin + 'Balance'}
      >
        {balance}
      </CoinDisplay>
    </>
  )
}

export default Success
