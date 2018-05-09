import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Link, Text } from 'blockchain-info-components'

import { required } from 'services/FormHelper'
import { flex, spacing } from 'services/StyleService'
import { StepTransition } from 'components/Utilities/Stepper'
import { Form, ColLeft, InputWrapper, PartnerHeader, PartnerSubHeader, ColRight, ColRightInner } from 'components/BuySell/Signup'
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
  const { invalid, submitting } = props
  return (
    <Form>
      <ColLeft>
        <BorderBox>
          <InputWrapper style={spacing('mb-40')}>
            <PartnerHeader>
              <FormattedMessage id='coinifyexchangedata.addbankdetails.header' defaultMessage='Add Bank Account' />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage id='coinifyexchangedata.addbankdetails.subheader' defaultMessage='Please enter your bank information below.' />
            </PartnerSubHeader>
            <Text weight={300} size='12px'>
              <FormattedMessage id='coinifyexchangedata.addbankdetails.iban' defaultMessage='International Bank Account (IBAN)' />
              <Field name='iban' validate={[required]} component={TextBox} />
            </Text>
            <Text weight={300} size='12px'>
              <FormattedMessage id='coinifyexchangedata.addbankdetails.swift' defaultMessage='Bank Identifier Code (SWIFT/BIC)' />
              <Field name='swift' validate={[required]} component={TextBox} />
            </Text>
          </InputWrapper>
        </BorderBox>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <StepTransition next Component={Button} style={spacing('mt-45')} nature='primary' fullwidth disabled={submitting || invalid}>
            <FormattedMessage id='coinifyexchangedata.addbankdetails.continue' defaultMessage='Continue' />
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
