import { FlyoutWrapper } from 'components/Flyout'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import Header from './Header'
import Info from './Info'
import NewLoanInfo from './NewLoanInfo'
import React from 'react'
import Summary from './Summary'

export type Props = OwnProps & SuccessStateType & LinkDispatchPropsType

const Success: React.FC<Props> = props => {
  // debugging
  // props.loan.status = 'OPEN'
  // props.loan.collateralisationRatio = 1.3

  if (!props.offer) return null

  return (
    <FlyoutWrapper>
      <Header {...props} />
      {props.loan.status === 'PENDING_EXECUTION' ||
      props.loan.status === 'PENDING_COLLATERAL_DEPOSIT' ? (
        <NewLoanInfo {...props} />
      ) : (
        <Info {...props} />
      )}
      <Summary {...props} />
    </FlyoutWrapper>
  )
}

export default Success
