import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Link, Text } from 'blockchain-info-components'

import { flex, spacing } from 'services/StyleService'
import { StepTransition } from 'components/Utilities/Stepper'
import { Form, ColLeft, InputWrapper, PartnerHeader, PartnerSubHeader, ColRight, ColRightInner, Row } from 'components/BuySell/Signup'
import { TextBox } from 'components/Form'

const CancelWrapper = styled.div`
  a {
    color: #545456;
    font-weight: 300;
    font-size: 14px;
  }
`
const BorderBox = styled.div`
  border: 1px solid ${props => props.theme['gray-1']};
  padding: 30px;
`

const AddBankDetails = (props) => {
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
            <Text weight={300} size='12px'>
              <FormattedMessage id='coinifyexchangedata.addcustomerdetails.fullname' defaultMessage='Account Holder’s Full Name' />
              <Field component={TextBox} />
            </Text>
            <Text weight={300} size='12px'>
              <FormattedMessage id='coinifyexchangedata.addcustomerdetails.street' defaultMessage='Street and Number' />
              <Field component={TextBox} />
            </Text>
            <Row>
              <Text weight={300} size='12px'>
                <FormattedMessage id='coinifyexchangedata.addcustomerdetails.city' defaultMessage='City' />
                <Field component={TextBox} />
              </Text>
              <Text weight={300} size='12px'>
                <FormattedMessage id='coinifyexchangedata.addcustomerdetails.postcode' defaultMessage='Postal Code' />
                <Field component={TextBox} />
              </Text>
            </Row>
            <Text weight={300} size='12px'>
              <FormattedMessage id='coinifyexchangedata.addcustomerdetails.country' defaultMessage='Country' />
              <Field component={TextBox} />
            </Text>
          </InputWrapper>
        </BorderBox>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <StepTransition next Component={Button} style={spacing('mt-45')} nature='primary' fullwidth>
            <FormattedMessage id='coinifyexchangedata.addcustomerdetails.continue' defaultMessage='Continue' />
          </StepTransition>
          <CancelWrapper style={{ ...flex('row justify/center'), ...spacing('mt-15') }}>
            <StepTransition prev Component={Link}>
              <FormattedMessage id='back' defaultMessage='Back' />
            </StepTransition>
          </CancelWrapper>
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'coinifyAddBankDetails' })(AddBankDetails)
