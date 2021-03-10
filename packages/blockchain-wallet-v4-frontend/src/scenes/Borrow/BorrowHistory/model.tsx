import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text, TooltipHost } from 'blockchain-info-components'
import { LoanTransactionsType, LoanType } from 'blockchain-wallet-v4/src/types'
import CoinDisplay from 'components/Display/CoinDisplay'

// same style for all children
export const Value = styled(Text)<{ size?: string }>`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  color: ${props => props.theme.grey800};
  * {
    font-size: 14px !important;
    font-weight: 500 !important;
    color: ${props => props.theme.grey800} !important;
  }
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
    case 'PENDING_COLLATERAL_DEPOSIT':
      return <OrangeValue>Pending</OrangeValue>
    case 'PENDING_PRINCIPAL_WITHDRAW':
      return <OrangeValue>Pending Principal</OrangeValue>
    case 'PENDING_CLOSE':
      return <OrangeValue>Repayment in-progress</OrangeValue>
    case 'ON_CALL':
      return <Value>On Call</Value>
    case 'CLOSED':
      return <Value>Closed</Value>
    case 'LIQUIDATED':
      return <RedValue>Liquidated</RedValue>
    case 'FAILED':
      return <RedValue>Failed</RedValue>
    default:
      return <Value>Unknown Status</Value>
  }
}

export const CollateralAmt = (props: {
  loan: LoanType
  loanTransactions?: Array<LoanTransactionsType>
}) => {
  switch (props.loan.status) {
    case 'PENDING_EXECUTION':
    case 'PENDING_COLLATERAL_DEPOSIT':
      const lastRequestedDeposit =
        props.loanTransactions &&
        props.loanTransactions.find(
          tx => tx.status === 'REQUESTED' && tx.type === 'DEPOSIT_COLLATERAL'
        )

      return props.loanTransactions ? (
        <TooltipHost id='borrow.collateralpending.tooltip'>
          <CoinDisplay
            size='14px'
            weight={600}
            italic
            coin={
              lastRequestedDeposit
                ? lastRequestedDeposit.request.amount.currency
                : props.loan.collateral.amounts[0].currency
            }
          >
            {lastRequestedDeposit
              ? lastRequestedDeposit.request.amount.amount
              : props.loan.collateral.amounts[0].amount}
          </CoinDisplay>
        </TooltipHost>
      ) : (
        <Text size='14px' weight={600} italic>
          <FormattedMessage id='copy.pending' defaultMessage='Pending' />
        </Text>
      )
    default:
      return (
        <CoinDisplay
          size='14px'
          weight={500}
          color='grey800'
          coin={props.loan.collateral.amounts[0].currency}
        >
          {props.loan.collateral.amounts[0].amount}
        </CoinDisplay>
      )
  }
}
