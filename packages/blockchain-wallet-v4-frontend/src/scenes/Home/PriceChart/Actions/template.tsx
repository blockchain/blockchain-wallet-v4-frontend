import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { CoinType } from 'core/types'
import { media } from 'services/styles'

import { Props } from '.'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  ${media.atLeastTabletL`
    margin-top: 24px;
    margin-right: 24px;
  `}
`

const BuyTradeButton = styled(Button)`
  &:first-child {
    margin-right: 12px;
  }
`

const Actions = ({ coinName, cryptoCurrency, simpleBuyActions, swapActions }: Props) => {
  return (
    <Wrapper>
      <BuyTradeButton
        data-e2e='buyButton'
        height='42px'
        nature='primary'
        onClick={() => simpleBuyActions.showModal('PriceChart', cryptoCurrency as CoinType, 'BUY')}
      >
        <Text color='white' size='16px' lineHeight='24px' weight={600}>
          <FormattedMessage
            id='price.chart.buy.coin'
            defaultMessage='Buy {coinName}'
            values={{ coinName }}
          />
        </Text>
      </BuyTradeButton>
      <BuyTradeButton
        data-e2e='swapButton'
        height='42px'
        nature='empty-secondary'
        onClick={() => swapActions.showModal('PriceChart')}
      >
        <Text color='blue600' size='16px' lineHeight='24px' weight={600}>
          <FormattedMessage
            id='price.chart.swap.coin'
            defaultMessage='Swap {coinName}'
            values={{ coinName }}
          />
        </Text>
      </BuyTradeButton>
    </Wrapper>
  )
}

export default Actions
