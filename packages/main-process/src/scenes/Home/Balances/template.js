import React from 'react'
import styled from 'styled-components'

import Tabs from './Tabs'
import Table from './Table'

const Wrapper = styled.div`
  width: 100%;
  height: 450px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid ${props => props.theme['gray-1']};
`

const BalancesTable = props => {
  const { currentTab } = props
  return (
    <Wrapper>
      <Tabs {...props} />
      {currentTab === 'total' && <Table viewType='Total' />}
      {currentTab === 'wallet' && <Table viewType='Wallet' />}
      {currentTab === 'lockbox' && <Table viewType='Hardware' />}
    </Wrapper>
  )
}

export default BalancesTable
