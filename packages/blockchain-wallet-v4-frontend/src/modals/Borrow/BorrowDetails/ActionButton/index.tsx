import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { last } from 'ramda'
import { Props } from '../template.success'
import React from 'react'

const ActionButton: React.FC<Props> = props => {
  const lastDeposit = last(props.loanTransactions)
  const lastPrincipalDepositFailed =
    lastDeposit &&
    lastDeposit.type === 'DEPOSIT_PRINCIPAL_AND_INTEREST' &&
    lastDeposit.status === 'FAILED'

  switch (true) {
    case props.loan.status === 'OPEN':
      return (
        <Button
          fullwidth
          nature='dark-grey'
          data-e2e='endBorrow'
          onClick={() =>
            props.borrowActions.setStep({
              step: 'REPAY_LOAN',
              offer: props.offer,
              loan: props.loan
            })
          }
        >
          <FormattedMessage
            id='modals.details.borrow.endborrow'
            defaultMessage='End Borrowing'
          />
        </Button>
      )
    case props.loan.status === 'PENDING_CLOSE' && lastPrincipalDepositFailed:
      return (
        <Button
          fullwidth
          nature='dark-grey'
          data-e2e='endBorrow'
          onClick={() =>
            props.borrowActions.setStep({
              step: 'REPAY_LOAN',
              offer: props.offer,
              loan: props.loan
            })
          }
        >
          <FormattedMessage
            id='modals.details.borrow.retryrepayment'
            defaultMessage='Retry Repayment'
          />
        </Button>
      )
    default: {
      return (
        <Button
          fullwidth
          nature='light'
          data-e2e='closeBorrowDetails'
          onClick={() => props.handleClose()}
        >
          <FormattedMessage
            id='modals.details.borrow.close'
            defaultMessage='Close'
          />
        </Button>
      )
    }
  }
}

export default ActionButton
