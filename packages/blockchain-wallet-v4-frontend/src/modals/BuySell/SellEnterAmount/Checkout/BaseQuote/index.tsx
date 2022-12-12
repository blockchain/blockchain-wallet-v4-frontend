import React from 'react'
import styled from 'styled-components'

import { BSOrderActionType, CoinType, OrderType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import { DisplayContainer } from 'components/BuySell'
import { Value } from 'components/Flyout'
import { media } from 'services/styles'
import { hexToRgb } from 'utils/helpers'

const CheckoutDisplayContainer = styled(DisplayContainer)`
  ${media.tablet`
    padding: 1rem 1.25rem;
  `}
`

const Display = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.grey800};
`

const IconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  z-index: 100;
  background: white;
`
const StyledIcon = styled(Icon)<{ background: string }>`
  background: rgba(${(props) => hexToRgb(props.theme[props.background] || '#000000')}, 0.15);
  border-radius: 50%;

  & :not(::before) {
    opacity: 0.15;
  }

  &::before {
    color: ${(props) => props.theme[props.background]};
  }
`
const PlusMinusIconWrapper = styled.div`
  z-index: 10;
`

const BaseQuote = ({ coin, orderType }: { coin: CoinType; orderType: BSOrderActionType }) => {
  const { coinfig } = window.coins[coin]
  const displayName = coinfig.name

  return (
    <CheckoutDisplayContainer>
      <Icon size='32px' color={coin} name={coin} style={{ left: '5px', position: 'relative' }} />
      <PlusMinusIconWrapper>
        <IconBackground>
          <StyledIcon
            name={orderType === OrderType.BUY ? 'plus' : 'minus'}
            size='24px'
            background={coin}
          />
        </IconBackground>
      </PlusMinusIconWrapper>

      <Display>
        <Value>{displayName}</Value>
      </Display>
    </CheckoutDisplayContainer>
  )
}

export default BaseQuote
