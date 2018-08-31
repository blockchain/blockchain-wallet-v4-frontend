import React from 'react'
import styled from 'styled-components'
import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  min-width: 160px;
  padding: 10px;
  > div:not(:last-child) {
    margin-bottom: 5px;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px !important;
`

export const CoinBalanceWrapper = props => {
  const CoinBalanceMain = styled.div`
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    font-weight: 200;
    padding-right: 15px;
    > div:last-child {
      margin-left: 10px;
      > div {
        color: ${props => props.theme['gray-3']};
      }
    }
  `
  const CoinBalanceSwitchable = styled.div`
    display: flex;
    justify-content: space-between;
  `
  return props.large ? (
    <CoinBalanceMain>
      <CoinDisplay
        coin={props.coin}
        cursor='pointer'
        mobileSize='14px'
        size='20px'
        weight={200}
      >
        {props.balance}
      </CoinDisplay>
      <FiatDisplay
        coin={props.coin}
        cursor='pointer'
        mobileSize='14px'
        size='20px'
        weight={200}
      >
        {props.balance}
      </FiatDisplay>
    </CoinBalanceMain>
  ) : (
    <CoinBalanceSwitchable>
      <Text size='12px' weight={300}>
        {props.coin}
      </Text>
      <SwitchableDisplay size='12px' weight={400} coin={props.coin}>
        {props.balance}
      </SwitchableDisplay>
    </CoinBalanceSwitchable>
  )
}

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
  @media (min-width: 768px) {
    padding: 15px 30px;
  }
`

export const HomeBalanceHeaderTitle = styled(Text)`
  font-size: 20px;
  font-weight: 200;
  text-transform: uppercase;
  color: ${props => props.theme['brand-primary']};
`

export const HomeBalanceAmount = styled(Text)`
  font-size: 28px;
  font-weight: 200;
  margin-top: 10px;
  color: ${props => props.theme['brand-primary']};
`

export const HomeCoinBalanceCell = props => {
  const coinColor = props.coin.toLowerCase()

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
    font-size: 24px;
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

  return (
    <Wrapper>
      <Coin>
        <CoinIcon color={coinColor} name={props.coinIcon} />
        <CoinName color={coinColor}>{props.coinName}</CoinName>
      </Coin>
      <Amount>
        <CoinDisplay
          coin={props.coin}
          size='14px'
          cursor='pointer'
          mobileSize='14px'
          color='brand-primary'
          weight={300}
        >
          {props.balance}
        </CoinDisplay>
        <FiatDisplay
          coin={props.coin}
          size='14px'
          cursor='pointer'
          mobileSize='14px'
          color='gray-3'
          weight={300}
        >
          {props.balance}
        </FiatDisplay>
      </Amount>
    </Wrapper>
  )
}

export const CurrencyItem = props => {
  const Wrapper = styled.div`
    display: flex;
    padding: 15px;
    margin-right: 20px;
    flex-direction: row;
    align-items: center;
    border-radius: 3px;
    background-color: ${props => props.theme['white-blue']};
    cursor: pointer;
    * {
      cursor: pointer;
    }
  `
  const IconBox = styled.div`
    padding: 5px;
    margin-right: 10px;
    border-radius: 3px;
    background-color: ${props => props.theme[props.coin]};
  `
  const Balance = styled.div`
    > div:first-child {
      margin-bottom: 3px;
    }
  `

  return (
    <Wrapper>
      <IconBox coin={props.coin}>
        <Icon size='32px' color='white' name={props.icon} />
      </IconBox>
      <Balance>
        <FiatDisplay size='14px' weight={400} coin={props.coin.toUpperCase()}>
          {props.balance}
        </FiatDisplay>
        <CoinDisplay size='13px' weight={200} coin={props.coin.toUpperCase()}>
          {props.balance}
        </CoinDisplay>
      </Balance>
    </Wrapper>
  )
}
