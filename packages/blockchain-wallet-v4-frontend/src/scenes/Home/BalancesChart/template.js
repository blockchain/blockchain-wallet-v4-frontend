import React from 'react'
import styled from 'styled-components'

import Tabs from './Tabs'
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

const BalancesChart = props => {
  const { currentTab } = props
  return (
    <Wrapper>
      <Tabs />
      {currentTab === 'total' && <TotalBalance />}
      {currentTab === 'wallet' && <WalletBalance />}
      {currentTab === 'lockbox' && <LockboxBalance />}
    </Wrapper>
  )
}

export default BalancesChart
