import { Button } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import Header from './Header'
import Info from './Info'
import NewLoanInfo from './NewLoanInfo'
import React from 'react'
import styled from 'styled-components'
import Summary from './Summary'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export type Props = OwnProps & SuccessStateType & LinkDispatchPropsType

const Success: React.FC<Props> = props => {
  // debugging
  // props.loan.status = 'OPEN'
  // props.loan.collateralisationRatio = 1.3

  if (!props.offer) return null

  return (
    <Wrapper>
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
      <FlyoutWrapper style={{ paddingTop: '0px' }}>
        <Button
          fullwidth
          nature='dark-grey'
          data-e2e='endBorrow'
          onClick={() =>
            props.borrowActions.setStep({
              step: 'END_BORROW',
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
      </FlyoutWrapper>
    </Wrapper>
  )
}

export default Success
