import { LoanType } from 'core/types'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

export const Value = styled(Text)<{ size?: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`

const OrangeValue = styled(Value)`
  color: ${props => props.theme.orange600};
`
const GreenValue = styled(Value)`
  color: ${props => props.theme.green600};
`
const RedValue = styled(Value)`
  color: ${props => props.theme.red600};
`

export const Status = (props: LoanType) => {
  switch (props.status) {
    case 'OPEN':
      return <GreenValue>Open</GreenValue>
    case 'PENDING_EXECUTION':
      return <OrangeValue>Pending</OrangeValue>
    case 'PENDING_COLLATERAL_DEPOSIT':
      return <OrangeValue>Pending Collateral Deposit</OrangeValue>
    case 'PENDING_PRINCIPAL_WITHDRAW':
      return <OrangeValue>Pending Principal Withdraw</OrangeValue>
    case 'ON_CALL':
      return <Value>On Call</Value>
    case 'CLOSED':
      return <Value>Closed</Value>
    case 'PENDING_CLOSE':
      return <Value>Pending Close</Value>
    case 'LIQUIDATED':
      return <RedValue>Liquidated</RedValue>
    case 'FAILED':
      return <RedValue>Failed</RedValue>
    default:
      return <Value>Unknown Status</Value>
  }
}
