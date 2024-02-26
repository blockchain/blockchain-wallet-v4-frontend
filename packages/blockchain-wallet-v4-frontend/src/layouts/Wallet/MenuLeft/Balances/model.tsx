import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { SkeletonRectangle, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const CoinBalanceMain = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding-right: 15px;
  > div:last-child {
    margin-left: 10px;
    > div {
      color: ${(props) => props.theme.blue900};
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
  color: ${(props) => props.theme.grey800};
`

export const BalancesWrapper = styled.div`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s;
  &.active {
    max-height: ${(props) => React.Children.count(props.children) * 30}px;
  }
`

type Props = {
  balance: number
  coin: string
  coinTicker: string
}

export const CoinBalanceWrapper = ({ balance, coin, coinTicker }: Props) => {
  return (
    <LinkContainer to={`/coins/${coin}`}>
      <CoinBalanceSwitchable>
        <CoinNameText>{coinTicker ?? coin}</CoinNameText>
        <SwitchableDisplay size='12px' weight={500} coin={coin} hideCoinTicker>
          {balance}
        </SwitchableDisplay>
      </CoinBalanceSwitchable>
    </LinkContainer>
  )
}

export const LoadingBalance = ({ coinTicker }: { coinTicker: string }) => {
  return (
    <CoinSkeletonWrapper>
      <Text size='12px' weight={600} color='grey800'>
        {coinTicker}
      </Text>
      <SkeletonRectangle width='40px' height='12px' />
    </CoinSkeletonWrapper>
  )
}
