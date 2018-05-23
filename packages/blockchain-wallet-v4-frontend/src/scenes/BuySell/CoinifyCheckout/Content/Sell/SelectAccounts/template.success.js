import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { equals, isNil, or, path } from 'ramda'
import { Button, Icon, Link, Text } from 'blockchain-info-components'

import { spacing } from 'services/StyleService'
import { RadioButton } from 'components/Form'
import { StepTransition } from 'components/Utilities/Stepper'
import { Form, ColLeft, InputWrapper, PartnerHeader, PartnerSubHeader, ColRight, ColRightInner, Row } from 'components/BuySell/Signup'

const CancelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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
const ClickableIcon = styled(Icon)`
  cursor: pointer;
`

const SelectAccounts = (props) => {
  const { invalid, submitting, bankAccounts, deleteBankAccount, radioButtonSelected } = props
  const noRadioButtonSelected = or(isNil(radioButtonSelected), equals(radioButtonSelected, ''))

  return (
    <Form>
      <ColLeft>
        <BorderBox>
          <InputWrapper style={spacing('mb-40')}>
            <PartnerHeader>
              <FormattedMessage id='coinifyexchangedata.selectaccounts.header' defaultMessage='Select Accounts' />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage id='coinifyexchangedata.selectaccounts.subheader' defaultMessage='Where would you like your funds sent? You have the following bank accounts linked: ' />
            </PartnerSubHeader>
            {bankAccounts && bankAccounts.map((b, index) =>
              <Row key={index}>
                <Field name='iban' component={RadioButton} props={{ id: `iban${index}`, value: index }} />
                <Text weight={300}>{path(['_account', '_number'], b)}</Text>
                <ClickableIcon name='trash' onClick={() => deleteBankAccount(b)} />
              </Row>
            )}
          </InputWrapper>
          <StepTransition next Component={Button} style={spacing('mt-45')} nature='primary' fullwidth disabled={submitting || invalid}>
            <FormattedMessage id='coinifyexchangedata.selectaccounts.continue' defaultMessage='Add new account' />
          </StepTransition>
        </BorderBox>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <StepTransition next Component={Button} style={spacing('mt-45')} nature='primary'
            fullwidth disabled={submitting || invalid || noRadioButtonSelected}>
            <FormattedMessage id='coinifyexchangedata.selectaccounts.continue' defaultMessage='Continue' />
          </StepTransition>
          <CancelWrapper style={spacing('mt-15')}>
            <StepTransition prev Component={Link}>
              <FormattedMessage id='back' defaultMessage='Back' />
            </StepTransition>
          </CancelWrapper>
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'radioButtonSelected' })(SelectAccounts)
