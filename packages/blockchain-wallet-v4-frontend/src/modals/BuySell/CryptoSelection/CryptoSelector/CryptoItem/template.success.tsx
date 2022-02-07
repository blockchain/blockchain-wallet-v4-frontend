import React, { memo } from 'react'
import { equals } from 'ramda'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { OrderType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import { DisplayContainer } from 'components/BuySell'
import { Title, Value } from 'components/Flyout'
import { media } from 'services/styles'
import { hexToRgb } from 'utils/helpers'

import PriceMovement from '../PriceMovement'
import { OwnProps as ParentOwnProps, Props as OwnProps, SuccessStateType } from '.'

const CheckoutDisplayContainer = styled(DisplayContainer)`
  ${media.tablet`
    padding: 16px 20px;
  `}
`

const Display = styled.div<{ canClick: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  width: 100%;
  cursor: ${(props) => (props.canClick ? 'pointer' : 'initial')};
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.grey800};
`
const DisplayTitle = styled(Title)`
  margin-top: 4px;
  display: flex;
  align-items: center;
  font-weight: 600;
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

type Props = OwnProps & ParentOwnProps & SuccessStateType

const Success = memo(
  ({ coin, fiat, onClick, orderType, rates }: Props) => {
    const { coinfig } = window.coins[coin]
    const displayName = coinfig.name
    return (
      <CheckoutDisplayContainer
        data-e2e={`sb${coin}-${fiat}CurrencySelector`}
        role='button'
        onClick={onClick}
      >
        {onClick && <Icon size='32px' color={coin} name={coin} />}
        <Display canClick={!!onClick}>
          <Value style={{ marginTop: '0px' }}>{displayName}</Value>
          <DisplayTitle>
            {orderType === OrderType.BUY && (
              <>
                {fiatToString({
                  unit: fiat,
                  value: rates.price
                })}
                <PriceMovement coin={coin} fiat={fiat} />
              </>
            )}
          </DisplayTitle>
        </Display>
        {onClick && <Icon name='chevron-right' size='32px' color='grey400' />}
        {!onClick && (
          <>
            <Icon
              size='32px'
              color={coin}
              name={coin}
              style={{ left: '5px', position: 'relative' }}
            />
            <PlusMinusIconWrapper>
              <IconBackground>
                <StyledIcon
                  name={orderType === OrderType.BUY ? 'plus' : 'minus'}
                  size='24px'
                  background={coin}
                />
              </IconBackground>
            </PlusMinusIconWrapper>
          </>
        )}
      </CheckoutDisplayContainer>
    )
  },
  (prevProps, nextProps) => equals(prevProps, nextProps)
)

export default Success
