import React from 'react'
import styled from 'styled-components'
import { Icon, SkeletonRectangle, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  min-width: 160px;
  padding: 15px 20px 0px 20px;
  > div:not(:last-child) {
    margin-bottom: 5px;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px !important;
  // Caret icon rotation
  > span:last-child {
    transition: transform 0.3s;
    &.active {
      transform: rotate(90deg);
    }
  }
`

export const HeaderText = styled(Text)`
  display: flex;
  flex-direction: row;
`

export const BalancesWrapper = styled.div`
  max-height: 0px;
  overflow: hidden;
  transition: max-height 0.3s;
  &.active {
    max-height: ${props => props.items * 20}px;
  }
`

export const LoadingBalance = props => {
  const BalanceSkeleton = styled.div`
    margin-top: 4px;
  `
  const CoinSkeletonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `

  return props.large ? (
    <BalanceSkeleton>
      <SkeletonRectangle width='170px' height='24px' bgColor='white-blue' />
    </BalanceSkeleton>
  ) : (
    <CoinSkeletonWrapper>
      <Text size='12px' weight={300}>
        BTC
      </Text>
      <SkeletonRectangle width='40px' height='14px' bgColor='white-blue' />
    </CoinSkeletonWrapper>
  )
}

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
    opacity: 1;
    padding: 15px;
    margin-right: 25px;
    flex-direction: row;
    align-items: center;
    border-radius: 3px;
    transition: box-shadow 0.3s, opacity 0.3s;
    opacity: ${props => (props.isInactive ? 0.5 : 1)};
    background-color: ${props => props.theme['white-blue']};
    box-shadow: ${props =>
      props.isActive ? '0px 5px 30px 0px rgba(0,0,0,0.1)' : 'none'};
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
    <Wrapper
      onClick={props.onClick}
      isActive={props.isActive}
      isInactive={props.isInactive}
    >
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
