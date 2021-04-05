import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { toLower } from 'ramda'
import styled from 'styled-components'

import { SkeletonRectangle, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

import { Props as OwnProps } from './WalletBalance/Balance/template.success'

export const CoinBalanceMain = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding-right: 15px;
  > div:last-child {
    margin-left: 10px;
    > div {
      color: ${props => props.theme.blue900};
    }
  }
`
const CoinBalanceSwitchable = styled.div`
  display: flex;
  justify-content: space-between;
`

const BalanceSkeleton = styled.div`
  margin-top: 4px;
`
const CoinSkeletonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CoinNameText = styled(Text)`
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  color: ${props => props.theme.grey800};
`

export const BalancesWrapper = styled.div`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s;
  &.active {
    max-height: ${props => React.Children.count(props.children) * 30}px;
  }
`

export const CoinBalanceWrapper = (props: OwnProps) => {
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
    <LinkContainer to={`/${toLower(props.coin)}/transactions`}>
      <CoinBalanceSwitchable>
        <CoinNameText>
          {props.coinTicker ? props.coinTicker : props.coin}
        </CoinNameText>
        <SwitchableDisplay
          size='12px'
          weight={500}
          coin={props.coin}
          hideCoinTicker
        >
          {props.balance}
        </SwitchableDisplay>
      </CoinBalanceSwitchable>
    </LinkContainer>
  )
}

export const LoadingBalance = props => {
  return props.large ? (
    <BalanceSkeleton>
      <SkeletonRectangle width='170px' height='12px' />
    </BalanceSkeleton>
  ) : (
    <CoinSkeletonWrapper>
      <Text size='12px' weight={600} color='grey800'>
        {props.coinTicker}
      </Text>
      <SkeletonRectangle width='40px' height='12px' />
    </CoinSkeletonWrapper>
  )
}
