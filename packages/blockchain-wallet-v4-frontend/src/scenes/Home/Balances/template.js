import React from 'react'
import styled from 'styled-components'

import Tabs from './Tabs'
import Table from './Table'

const Wrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-1']};
  @media (min-width: 480px) {
    height: 380px;
  }
`

const BalancesTable = props => {
  const { currentTab, showLockbox } = props
  return showLockbox ? (
    <Wrapper>
      <Tabs {...props} />
      {currentTab === 'total' && <Table viewType='Total' />}
      {currentTab === 'wallet' && <Table viewType='Wallet' />}
      {currentTab === 'lockbox' && <Table viewType='Lockbox' />}
    </Wrapper>
  ) : (
    <Wrapper>
      <Table viewType='Wallet' />
    </Wrapper>
  )
}

export default BalancesTable
