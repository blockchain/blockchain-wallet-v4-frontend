import React from 'react'
import styled from 'styled-components'

import { Text, SkeletonRectangle } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

export const BalancesWrapper = styled.div`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s;
  &.active {
    max-height: ${props => React.Children.count(props.children) * 20}px;
  }
`

export const HeaderText = styled(Text)`
  display: flex;
  flex-direction: row;
`

const CoinBalanceMain = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding-right: 15px;
  > div:last-child {
    margin-left: 10px;
    > div {
      color: ${props => props.theme['brand-primary']};
    }
  }
`
const CoinBalanceSwitchable = styled.div`
  display: flex;
  justify-content: space-between;
`

export const CoinBalanceWrapper = props => {
  return props.large ? (
    <CoinBalanceMain>
      <CoinDisplay
        coin={props.coin}
        cursor='pointer'
        mobileSize='14px'
        size='18px'
        weight={400}
      >
        {props.balance}
      </CoinDisplay>
      <FiatDisplay
        coin={props.coin}
        cursor='pointer'
        mobileSize='14px'
        size='18px'
        weight={400}
      >
        {props.balance}
      </FiatDisplay>
    </CoinBalanceMain>
  ) : (
    <CoinBalanceSwitchable>
      <Text size='12px' weight={400}>
        {props.coinTicker ? props.coinTicker : props.coin}
      </Text>
      <SwitchableDisplay
        size='12px'
        weight={500}
        coin={props.coin}
        hideCoinTicker
      >
        {props.balance}
      </SwitchableDisplay>
    </CoinBalanceSwitchable>
  )
}

const BalanceSkeleton = styled.div`
  margin-top: 4px;
`
const CoinSkeletonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const LoadingBalance = props => {
  return props.large ? (
    <BalanceSkeleton>
      <SkeletonRectangle width='170px' height='24px' bgColor='gray-1' />
    </BalanceSkeleton>
  ) : (
    <CoinSkeletonWrapper>
      <Text size='12px' weight={400}>
        {props.coinTicker}
      </Text>
      <SkeletonRectangle width='40px' height='14px' bgColor='gray-1' />
    </CoinSkeletonWrapper>
  )
}
