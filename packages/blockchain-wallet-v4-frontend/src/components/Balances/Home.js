import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'
import styled from 'styled-components'

export const HomeBalanceTable = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const HomeBalanceRow = styled.div`
  flex: auto;
  display: flex;
  padding: 20px 0px;
  flex-direction: column;
  justify-content: center;
  &:first-child {
    flex: 1;
    display: block;
    padding: 15px 0px;
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme['gray-1']};
  }
  @media (max-width: 480px) {
    padding: 15px 0px;
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Coin = styled.div`
  display: flex;
  align-items: center;
`
const CoinName = styled(Text)`
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`
const CoinIcon = styled(Icon)`
  font-size: 32px;
  margin-right: 16px;
`
const Amount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  > div:last-child {
    margin-top: 5px;
  }
`

export const HomeCoinBalanceCell = props => {
  const { balance, coin, coinIcon, coinName } = props

  return (
    <Wrapper>
      <Coin>
        <CoinIcon color={coin.toLowerCase()} name={coinIcon} />
        <CoinName color={'gray-5'}>{coinName}</CoinName>
      </Coin>
      <Amount>
        <FiatDisplay
          coin={coin}
          size='16px'
          cursor='pointer'
          mobileSize='16px'
          color='blue900'
          weight={400}
          data-e2e={coin + 'FiatBalance'}
        >
          {balance}
        </FiatDisplay>
        <CoinDisplay
          coin={coin}
          size='12px'
          cursor='pointer'
          mobileSize='12px'
          color='gray-3'
          weight={400}
          data-e2e={coin + 'Balance'}
        >
          {balance}
        </CoinDisplay>
      </Amount>
    </Wrapper>
  )
}
