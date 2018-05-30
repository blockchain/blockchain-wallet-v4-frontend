import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Link, Text } from 'blockchain-info-components'

import { required } from 'services/FormHelper'
import { spacing } from 'services/StyleService'
import { StepTransition } from 'components/Utilities/Stepper'
import { Form, CancelWrapper, ColLeft, ColLeftInner, ColRight, ColRightInner, InputWrapper, PartnerHeader, PartnerSubHeader, Row } from 'components/BuySell/Signup'
import { SelectBoxCountry, TextBox } from 'components/Form'

const BorderBox = styled.div`
  border: 1px solid ${props => props.theme['gray-1']};
  padding: 30px;
`
const SpaceRow = styled(Row)`
  width: 100%;
  justify-content: space-between;
`
const FieldText = styled(Text)`
  padding-bottom: 10px;
  padding-top: 20px;
`

const AddBankDetails = (props) => {
  const { invalid, submitting, onSubmit, medium, account } = props
  return (
    <Form>
      <ColLeft>
        <BorderBox>
          <InputWrapper style={spacing('mb-40')}>
            <PartnerHeader>
              <FormattedMessage id='coinifyexchangedata.addcustomerdetails.header' defaultMessage='Add Bank Account' />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage id='coinifyexchangedata.addcustomerdetails.subheader' defaultMessage='Who owns this bank account?  This information should match the holder’s bank statement. ' />
            </PartnerSubHeader>
            <FieldText weight={300} size='12px'>
              <FormattedMessage id='coinifyexchangedata.addcustomerdetails.' defaultMessage='Account Holder’s Full Name' />
            </FieldText>
            <Field name='fullname' validate={[required]} component={TextBox} />
            <FieldText weight={300} size='12px'>
              <FormattedMessage id='coinifyexchangedata.addcustomerdetails.' defaultMessage='Street and Number' />
            </FieldText>
            <Field name='street' validate={[required]} component={TextBox} />
            <SpaceRow>
              <ColLeftInner>
                <FieldText weight={300} size='12px'>
                  <FormattedMessage id='coinifyexchangedata.addcustomerdetails.' defaultMessage='City' />
                </FieldText>
                <Field name='city' validate={[required]} component={TextBox} />
              </ColLeftInner>
              <ColRightInner>
                <FieldText weight={300} size='12px'>
                  <FormattedMessage id='coinifyexchangedata.addcustomerdetails.' defaultMessage='Postal Code' />
                </FieldText>
                <Field name='postcode' validate={[required]} component={TextBox} />
              </ColRightInner>
            </SpaceRow>
            <FieldText weight={300} size='12px'>
              <FormattedMessage id='coinifyexchangedata.addcustomerdetails.' defaultMessage='Country' />
            </FieldText>
            <Field name='country' validate={[required]} component={SelectBoxCountry} />
          </InputWrapper>
        </BorderBox>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <StepTransition next Component={Button} style={spacing('mt-45')} nature='primary' fullwidth disabled={submitting || invalid} onClick={() => onSubmit(medium, account)}>
            <FormattedMessage id='coinifyexchangedata.addcustomerdetails.continue' defaultMessage='Continue' />
          </StepTransition>
          <CancelWrapper>
            <StepTransition prev Component={Link}>
              <FormattedMessage id='back' defaultMessage='Back' />
            </StepTransition>
          </CancelWrapper>
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'coinifyAddCustomerDetails', destroyOnUnmount: false })(AddBankDetails)
