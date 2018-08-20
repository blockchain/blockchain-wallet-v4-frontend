import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import TotalBalance from './TotalBalance'
import WalletBalance from './WalletBalance'
import LockboxBalance from './LockboxBalance'

const Wrapper = styled.div`
  width: 100%;
  height: 400px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
  border: 1px solid ${props => props.theme['gray-1']};
  @media (min-width: 480px) {
    height: 380px;
  }
`

const BalancesChart = () => {
  return (
    <Wrapper>
      <Text uppercase color='brand-primary' weight={300} size='24px'>
        <FormattedMessage
          id='scenes.home.balanceschart.balances'
          defaultMessage='Balances'
        />
      </Text>
      <TotalBalance />
      <WalletBalance />
      <LockboxBalance />
    </Wrapper>
  )
}

export default BalancesChart
