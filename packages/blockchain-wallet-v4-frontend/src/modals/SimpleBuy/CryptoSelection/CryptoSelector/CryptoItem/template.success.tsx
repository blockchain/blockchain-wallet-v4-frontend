import React from 'react'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

import { DisplayContainer } from 'components/SimpleBuy'
import { fiatToString } from 'core/exchange/currency'
import { Icon } from 'blockchain-info-components'
import {
  Props as OwnProps,
  OwnProps as ParentOwnProps,
  SuccessStateType
} from '.'
import { Title, Value } from 'components/Flyout'
import BalanceMovement from '../BalanceMovement'
import PriceMovement from '../PriceMovement'

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
  cursor: ${props => (props.canClick ? 'pointer' : 'initial')};
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`
const DisplayTitle = styled(Title)`
  margin-top: 4px;
  display: flex;
  align-items: center;
  color: ${props => props.theme.grey800};
`
const IconBackground = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  z-index: 100;
  background: ${props => props.theme[props.color]};
`
const PlusMinusIconWrapper = styled.div`
  z-index: 10;
`

type Props = OwnProps & ParentOwnProps & SuccessStateType

const Success: React.FC<Props> = props => {
  const coin = props.coin
  const fiat = props.fiat
  const coinType = props.supportedCoins[coin]
  const displayName = coinType.displayName
  const icon = coinType.icons.circleFilled
  const color = coinType.colorCode

  return (
    <CheckoutDisplayContainer
      data-e2e={`sb${props.coin}-${props.fiat}CurrencySelector`}
      role='button'
      onClick={props.onClick}
    >
      {props.onClick && <Icon size='32px' color={color} name={icon} />}
      <Display canClick={!!props.onClick}>
        <Value style={{ marginTop: '0px' }}>{displayName}</Value>
        <DisplayTitle>
          {props.orderType === 'BUY' && (
            <>
              {fiatToString({
                value: props.rates[fiat].last,
                unit: fiat
              })}
              <PriceMovement {...props} />
            </>
          )}
          {props.orderType === 'SELL' && <BalanceMovement coin={coin} />}
        </DisplayTitle>
      </Display>
      {props.onClick && (
        <Icon name='chevron-right' size='32px' color='grey600' />
      )}
      {!props.onClick && (
        <>
          <Icon
            size='32px'
            color={color}
            name={icon}
            style={{ position: 'relative', left: '5px' }}
          />
          <PlusMinusIconWrapper>
            <IconBackground color={`${color}-light`}>
              <Icon
                name={props.orderType === 'BUY' ? 'plus' : 'minus'}
                size='24px'
                color={color}
              />
            </IconBackground>
          </PlusMinusIconWrapper>
        </>
      )}
    </CheckoutDisplayContainer>
  )
}

export default Success
