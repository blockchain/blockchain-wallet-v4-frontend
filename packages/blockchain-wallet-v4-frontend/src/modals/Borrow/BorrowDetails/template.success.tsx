import { FlyoutWrapper } from 'components/Flyout'
import { OwnProps, SuccessStateType } from '.'
import Header from './Header'
import Info from './Info'
import NewLoanInfo from './NewLoanInfo'
import React from 'react'
import Summary from './Summary'

type Props = OwnProps & SuccessStateType

const Success: React.FC<Props> = props => {
  // debugging
  // props.loan.status = 'OPEN'
  // props.loan.collateralisationRatio = 1.12

  const offer = props.offers.find(offer => offer.id === props.loan.offerId)
  if (!offer) return null

  return (
    <FlyoutWrapper>
      <Header {...props} />
      {props.loan.status === 'PENDING_EXECUTION' ||
      props.loan.status === 'PENDING_COLLATERAL_DEPOSIT' ? (
        <NewLoanInfo {...props} />
      ) : (
        <Info {...props} offer={offer} />
      )}
      <Summary {...props} offer={offer} />
    </FlyoutWrapper>
  )
}

export default Success
