import { BackButton } from 'components/BuySell/styled'
import { BankOption, CardOption } from './mediumHelpers'
import { Form } from 'components/IdentityVerification'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { reduxForm } from 'redux-form'
import { StepTransition } from 'components/Utilities/Stepper'
import media from 'services/ResponsiveService'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const PaymentForm = styled(Form)`
  justify-content: center;
  ${media.mobile`
    flex-direction: column;
  `};
`
const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const PaymentHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
  text-align: center;
  margin-bottom: 50px;
  ${media.mobile`
    width: 100%;
    margin-bottom: 20px;
    margin-top: 30px;
  `};
`
const HeaderText = styled(Text)`
  margin-bottom: 15px;
  font-size: 32px;
  ${media.mobile`
    font-size: 24px;
    margin-top: 15px;
  `};
`
const PaymentMediumsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 400px;
  ${media.mobile`
    flex-direction: column;
    align-items: center;
    width: 100%;
  `};
`

const MediumWrapper = styled.div``

const Payment = props => {
  const { value, handlePaymentClick } = props
  const { disabledMedium } = value

  return (
    <PaymentForm>
      <PaymentContainer>
        <StepTransition prev Component={BackButton}>
          <Icon name='arrow-left' size='24px' color='brand-secondary' cursor />
        </StepTransition>
        <PaymentHeaderContainer>
          <HeaderText weight={500} color='brand-primary'>
            <FormattedMessage
              id='components.buysell.coinify.payment.header'
              defaultMessage='Select a Payment Method'
            />
          </HeaderText>
          <Text size='16px' weight={400}>
            <FormattedMessage
              id='components.buysell.coinify.payment.sub_header1'
              defaultMessage='You can link your bank account or credit card to buy cryptocurrency.'
            />
          </Text>
          <Text size='16px' weight={400}>
            <FormattedMessage
              id='components.buysell.coinify.payment.sub_header2'
              defaultMessage='Select the account that you would like to use to fund your purchases. You can always change your payment method.'
            />
          </Text>
        </PaymentHeaderContainer>
        <PaymentMediumsContainer>
          {disabledMedium.medium === 'bank' ? (
            <BankOption
              handlePaymentClick={() => {}}
              disabled={disabledMedium}
            />
          ) : (
            <StepTransition next Component={MediumWrapper}>
              <BankOption
                disabled={disabledMedium}
                handlePaymentClick={handlePaymentClick}
              />
            </StepTransition>
          )}
          {disabledMedium.medium === 'card' ? (
            <CardOption
              disabled={disabledMedium}
              handlePaymentClick={() => {}}
            />
          ) : (
            <StepTransition next Component={MediumWrapper}>
              <CardOption handlePaymentClick={handlePaymentClick} />
            </StepTransition>
          )}
        </PaymentMediumsContainer>
      </PaymentContainer>
    </PaymentForm>
  )
}

Payment.propTypes = {
  value: PropTypes.object.isRequired,
  handlePaymentClick: PropTypes.func.isRequired
}

export default reduxForm({ form: 'coinifyPayment' })(Payment)
