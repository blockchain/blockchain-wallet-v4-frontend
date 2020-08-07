import React from 'react'
import styled from 'styled-components'

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

type Props = OwnProps & ParentOwnProps & SuccessStateType

const Success: React.FC<Props> = props => {
  const coin = props.coin
  const fiat = props.fiat
  const coinType = props.supportedCoins[coin]
  const displayName = coinType.displayName
  const icon = coinType.icons.circleFilled
  const color = coinType.colorCode

  return (
    <DisplayContainer
      data-e2e={`sb${props.coin}-${props.fiat}CurrencySelector`}
      role='button'
      onClick={props.onClick}
    >
      <Icon size='32px' color={color} name={icon} />
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
    </DisplayContainer>
  )
}

export default Success
