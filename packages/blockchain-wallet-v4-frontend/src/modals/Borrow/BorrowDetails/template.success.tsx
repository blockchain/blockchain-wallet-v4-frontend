import { FlyoutWrapper } from 'components/Flyout'
import { OwnProps, SuccessStateType } from '.'
import Header from './Header'
import Info from './Info'
import NewLoanInfo from './NewLoanInfo'
import React from 'react'
import Summary from './Summary'

type Props = OwnProps & SuccessStateType

const Success: React.FC<Props> = props => {
  return (
    <FlyoutWrapper>
      <Header {...props} />
      {props.loan.status === 'PENDING_EXECUTION' ? (
        <NewLoanInfo {...props} />
      ) : (
        <Info {...props} />
      )}
      <Summary {...props} />
    </FlyoutWrapper>
  )
}

export default Success
