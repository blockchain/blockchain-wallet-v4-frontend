import React from 'react'
import styled from 'styled-components'
import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

export const HomeBalanceTable = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const HomeBalanceRow = styled.div`
  flex: auto;
  display: flex;
  padding: 10px 20px;
  flex-direction: column;
  justify-content: center;
  &:first-child {
    flex: 1;
    display: block;
    padding: 15px 30px;
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme['gray-1']};
  }
  @media (max-width: 480px) {
    padding: 15px 30px;
  }
`

export const HomeBalanceAmount = styled(Text)`
  margin: 5px 0;
  font-size: 28px;
  font-weight: 300;
  color: ${props => props.theme['brand-primary']};
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
  font-size: 16px;
  font-weight: 300;
`
const CoinIcon = styled(Icon)`
  font-size: 32px;
  margin-right: 10px;
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
        <CoinDisplay
          coin={coin}
          size='14px'
          cursor='pointer'
          mobileSize='14px'
          color='gray-5'
          weight={300}
          data-e2e={coin + 'Balance'}
        >
          {balance}
        </CoinDisplay>
        <FiatDisplay
          coin={coin}
          size='14px'
          cursor='pointer'
          mobileSize='14px'
          color='gray-3'
          weight={300}
          data-e2e={coin + 'FiatBalance'}
        >
          {balance}
        </FiatDisplay>
      </Amount>
    </Wrapper>
  )
}
