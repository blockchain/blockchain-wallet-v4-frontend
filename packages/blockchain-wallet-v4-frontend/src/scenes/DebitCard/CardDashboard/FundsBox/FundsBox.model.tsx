import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { SkeletonCircle, SkeletonRectangle, Text } from 'blockchain-info-components'

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
    <FormattedMessage id='scene.debit_card.funds_fail' defaultMessage='Failed to load balances' />
  </Text>
)
