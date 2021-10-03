import React from 'react'

import { Text } from 'blockchain-info-components'
import { FiatType } from 'blockchain-wallet-v4/src/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { SwapAccountType } from 'data/types'

const CoinAccountListBalance: React.FC<Props> = (props) => {
  return (
    <>
      <FiatDisplay
        size='14px'
        color='grey800'
        coin={props.account.coin}
        currency={props.walletCurrency}
        loadingHeight='24px'
        style={{
          cursor: !props.displayOnly ? 'pointer' : 'auto',
          lineHeight: 1.25
        }}
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
        style={{
          cursor: !props.displayOnly ? 'pointer' : 'auto',
          lineHeight: 1.25
        }}
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
  displayOnly?: boolean
  walletCurrency: FiatType
}

export default CoinAccountListBalance
