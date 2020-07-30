import { fiatToString } from 'core/exchange/currency'
import {
  getCoinFromPair,
  getFiatFromPair
} from 'data/components/simpleBuy/model'
import { Icon } from 'blockchain-info-components'
import {
  Props as OwnProps,
  OwnProps as ParentOwnProps,
  SuccessStateType
} from '.'
import { SupportedCoinType } from 'core/types'
import { Title, Value } from 'components/Flyout'
import BalanceMovement from '../BalanceMovement'
import PriceMovement from '../PriceMovement'
import React from 'react'
import styled from 'styled-components'

const DisplayContainer = styled.div<{
  coinType: SupportedCoinType
}>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: 16px 40px;
  border-bottom: 1px solid ${props => props.theme.grey000};
  &hover {
    background-color: ${props => props.theme.grey100};
  }
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
  color: ${props => props.theme.grey900};
`

type Props = OwnProps & ParentOwnProps & SuccessStateType

const Success: React.FC<Props> = props => {
  const coin = getCoinFromPair(props.value.pair)
  const fiat = getFiatFromPair(props.value.pair)
  const coinType = props.supportedCoins[coin]
  const displayName = coinType.displayName
  const icon = coinType.icons.circleFilled
  const color = coinType.colorCode

  return (
    <DisplayContainer
      coinType={coinType}
      data-e2e={`sb${props.value.pair}CurrencySelector`}
      role='button'
      onClick={props.onClick}
    >
      <Icon size='32px' color={color} name={icon} />
      <Display canClick={!!props.onClick}>
        <Value style={{ marginTop: '0px' }}>{displayName}</Value>
        <DisplayTitle>
          {fiatToString({
            value: props.rates[fiat].last,
            unit: fiat
          })}
          {props.actionType === 'BUY' && <PriceMovement {...props} />}
          {props.actionType === 'SELL' && <BalanceMovement coin={coin} />}
        </DisplayTitle>
      </Display>
      {props.onClick && (
        <Icon name='chevron-right' size='32px' color='grey600' />
      )}
    </DisplayContainer>
  )
}

export default Success
