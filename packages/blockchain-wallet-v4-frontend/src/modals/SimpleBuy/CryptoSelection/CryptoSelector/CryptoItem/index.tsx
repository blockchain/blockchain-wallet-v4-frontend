import { Icon } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import {
  CoinType,
  SBPairType,
  SupportedCoinsType,
  SupportedCoinType
} from 'core/types'
import { fiatToString } from 'core/exchange/currency'
import {
  getCoinFromPair,
  getFiatFromPair
} from 'data/components/simpleBuy/model'
import { RatesType } from 'data/types'
import { Title, Value } from 'components/Flyout'

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
const Display = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`

export type Props = {
  onClick: (string) => void
  rates: { [key in CoinType]: RatesType }
  supportedCoins: SupportedCoinsType
  value: SBPairType
}

const CryptoItem: React.FC<Props> = props => {
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
      <Display>
        <Value>{displayName}</Value>
        <Title>
          {fiatToString({
            value: props.rates[coin][fiat].last,
            unit: fiat
          })}
        </Title>
      </Display>
      <Icon name='chevron-right' size='32px' color='grey600' />
    </DisplayContainer>
  )
}

export default CryptoItem
