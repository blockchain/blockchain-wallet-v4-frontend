import React from 'react'
import styled from 'styled-components'

import { Icon, SkeletonCircle, SkeletonRectangle, Text } from 'blockchain-info-components'

export const Coin = styled.div`
  display: flex;
  align-items: center;
`
export const CoinIcon = styled(Icon)`
  font-size: 32px;
  margin-right: 16px;
`
export const CoinName = styled(Text)`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.grey900};
`
export const Amount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  > div:last-child {
    margin-top: 5px;
  }
`
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SkeletonLoader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > div:last-child {
    flex: 1;
    margin-left: 16px;
  }
  width: 100%;
`

export const LoadingDetail = () => (
  <>
    <SkeletonLoader>
      <SkeletonCircle height='32px' width='32px' />
      <SkeletonRectangle height='45px' width='100%' />
    </SkeletonLoader>
  </>
)

export const ErrorState = () => (
  <Text size='16px' weight={500} color='grey400' capitalize lineHeight='45px'>
    Failed to load balances
  </Text>
)
