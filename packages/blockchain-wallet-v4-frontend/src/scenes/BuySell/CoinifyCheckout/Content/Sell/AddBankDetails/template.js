import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { equals, prop } from 'ramda'

import { Button, Link, Text } from 'blockchain-info-components'
import { required, validIban, validBIC } from 'services/FormHelper'
import { spacing } from 'services/StyleService'
import { StepTransition } from 'components/Utilities/Stepper'
import { Form, ColLeft, InputWrapper, PartnerHeader, PartnerSubHeader, ColRight, ColRightInner } from 'components/BuySell/Signup'
import { TextBox } from 'components/Form'

const CancelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
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
const FieldText = styled(Text)`
  padding-bottom: 10px;
  padding-top: 20px;
`

const AddBankDetails = (props) => {
  const { invalid, submitting, quote } = props
  const currency = prop('baseCurrency', quote)

  return (
    <Form>
      <ColLeft>
        <BorderBox>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage id='coinifyexchangedata.addbankdetails.header' defaultMessage='Add Bank Account' />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage id='coinifyexchangedata.addbankdetails.subheader' defaultMessage='Please enter your bank information below.' />
            </PartnerSubHeader>
            {
              equals(currency, 'DKK')
                ? <div>
                  <FieldText weight={300} size='12px'>
                    <FormattedMessage id='coinifyexchangedata.addbankdetails.accountno' defaultMessage='Account Number' />
                  </FieldText>
                  <Field name='iban' validate={[required]} component={TextBox} />
                  <FieldText weight={300} size='12px'>
                    <FormattedMessage id='coinifyexchangedata.addbankdetails.reg' defaultMessage='REG Number' />
                  </FieldText>
                  <Field name='bic' validate={[required]} component={TextBox} />
                </div>
                : <div>
                  <FieldText weight={300} size='12px'>
                    <FormattedMessage id='coinifyexchangedata.addbankdetails.iban' defaultMessage='International Bank Account (IBAN)' />
                  </FieldText>
                  <Field name='iban' validate={[required, validIban]} component={TextBox} />
                  <FieldText weight={300} size='12px'>
                    <FormattedMessage id='coinifyexchangedata.addbankdetails.bic' defaultMessage='Bank Identifier Code (BIC)' />
                  </FieldText>
                  <Field name='bic' validate={[required, validBIC]} component={TextBox} />
                </div>
            }
            <Text weight={300} size='12px'>
              <FormattedMessage id='coinifyexchangedata.addbankdetails.incomplete' defaultMessage='Note: Incomplete or incorrect details will cause processing delays.' />
            </Text>
          </InputWrapper>
        </BorderBox>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <StepTransition next Component={Button} style={spacing('mt-45')} nature='primary' fullwidth disabled={submitting || invalid}>
            <FormattedMessage id='coinifyexchangedata.addbankdetails.continue' defaultMessage='Continue' />
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

export default reduxForm({ form: 'coinifyAddBankDetails', destroyOnUnmount: false })(AddBankDetails)
