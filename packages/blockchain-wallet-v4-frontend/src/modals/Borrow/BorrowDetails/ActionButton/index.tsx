import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Props } from '../template.success'
import React from 'react'

const ActionButton: React.FC<Props> = props => {
  switch (props.loan.status) {
    case 'CLOSED':
    case 'LIQUIDATED':
    case 'FAILED': {
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
    default: {
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
    }
  }
}

export default ActionButton
