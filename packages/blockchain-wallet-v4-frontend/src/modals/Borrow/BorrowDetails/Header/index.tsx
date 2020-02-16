import { FormattedMessage } from 'react-intl'
import { OwnProps, SuccessStateType } from '..'
import { Props } from '../template.success'
import { Text } from 'blockchain-info-components'
import React from 'react'

const Header: React.FC<Props> = props => {
  return (
    <Text color='grey900' size='20px' weight={600}>
      {props.loan.status === 'PENDING_EXECUTION' ||
      props.loan.status === 'PENDING_COLLATERAL_DEPOSIT' ? (
        <FormattedMessage
          id='modals.borrow.newloan'
          defaultMessage='New Loan'
        />
      ) : (
        <FormattedMessage
          id='modals.borrow.details'
          defaultMessage='Borrow Details'
        />
      )}
    </Text>
  )
}

export default Header
