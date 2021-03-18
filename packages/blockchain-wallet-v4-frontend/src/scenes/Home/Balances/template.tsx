import React from 'react'
import styled from 'styled-components'

import { media } from 'services/styles'

import Table from './Table'
import TotalRow from './TotalRow'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid ${props => props.theme.grey000};

  ${media.mobile`
    padding: 12px;
  `}
`

const BalancesTable = props => {
  return (
    <Wrapper>
      <TotalRow {...props} />
      <Table viewType='Total' {...props} />
    </Wrapper>
  )
}

export default BalancesTable
