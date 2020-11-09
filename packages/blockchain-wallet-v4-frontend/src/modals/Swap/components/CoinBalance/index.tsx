import { FiatType } from 'core/types'
import { SwapAccountType } from 'data/types'
import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'

const CoinBalance: React.FC<Props> = props => {
  return (
    <>
      <FiatDisplay
        size='14px'
        color='grey800'
        coin={props.account.coin}
        currency={props.walletCurrency}
        loadingHeight='24px'
        style={{ cursor: 'pointer', lineHeight: 1.25 }}
        weight={600}
      >
        {props.account.balance}
      </FiatDisplay>
      &nbsp;
      <Text size='14px' weight={600} color='grey600'>
        (
      </Text>
      <CoinDisplay
        size='14px'
        color='grey600'
        coin={props.account.coin}
        weight={600}
        style={{ cursor: 'pointer', lineHeight: 1.25 }}
      >
        {props.account.balance}
      </CoinDisplay>
      <Text size='14px' weight={600} color='grey600'>
        )
      </Text>
    </>
  )
}

type Props = {
  account: SwapAccountType
  walletCurrency: FiatType
}

export default CoinBalance
