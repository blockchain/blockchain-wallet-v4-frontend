import React from 'react'
import styled from 'styled-components'
import Table from './Table'
import Tabs from './Tabs'

const Wrapper = styled.div`
  width: 100%;
  height: ${({ isSilverOrAbove }) => (isSilverOrAbove ? '574px' : '450px')};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid ${props => props.theme['gray-1']};
`

const BalancesTable = props => {
  const { currentTab, isSilverOrAbove } = props
  return (
    <Wrapper isSilverOrAbove={isSilverOrAbove}>
      <Tabs {...props} />
      {currentTab === 'total' && <Table viewType='Total' />}
      {currentTab === 'wallet' && <Table viewType='Wallet' />}
      {currentTab === 'lockbox' && <Table viewType='Hardware' />}
    </Wrapper>
  )
}

export default BalancesTable
