import { LoanType } from 'core/types'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

export const Value = styled(Text)<{ size?: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`

const OrangeValue = styled(Value)`
  color: ${props => props.theme.orange600};
`

export const Status = (props: LoanType) => {
  switch (props.status) {
    case 'PENDING_EXECUTION':
      return <OrangeValue>Pending</OrangeValue>
    default:
      return <Value>Unknown Status</Value>
  }
}
