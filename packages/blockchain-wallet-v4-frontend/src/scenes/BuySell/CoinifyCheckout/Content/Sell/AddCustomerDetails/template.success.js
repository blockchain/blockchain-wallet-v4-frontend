import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Link, Text } from 'blockchain-info-components'

import { required } from 'services/FormHelper'
import { spacing } from 'services/StyleService'
import { StepTransition } from 'components/Utilities/Stepper'
import { BorderBox, Form, CancelWrapper, ColLeft, ColRight, ColRightInner, InputWrapper, PartnerHeader, PartnerSubHeader, Row } from 'components/BuySell/Signup'
import { SelectBoxCountry, TextBox } from 'components/Form'

const SpaceRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 55% 35%;
  grid-gap: 10%;
`
const FieldText = styled(Text)`
  padding-bottom: 10px;
  padding-top: 20px;
`
const Col = styled.div`
  width: 100%;
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
              <Col>
                <FieldText weight={300} size='12px'>
                  <FormattedMessage id='coinifyexchangedata.addcustomerdetails.' defaultMessage='City' />
                </FieldText>
                <Field name='city' validate={[required]} component={TextBox} />
              </Col>
              <Col>
                <FieldText weight={300} size='12px'>
                  <FormattedMessage id='coinifyexchangedata.addcustomerdetails.' defaultMessage='Postal Code' />
                </FieldText>
                <Field name='postcode' validate={[required]} component={TextBox} />
              </Col>
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
