import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { validEmail } from 'services/FormHelper'
import { Button, Link, Separator, Text } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const InfoMsg = styled(Text)`
  margin-top: 5px;
`
const BackLink = styled(Link)`
  margin-right: 15px;
`
const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

const validNullableEmail = emailVal => {
  return emailVal && emailVal.length ? validEmail(emailVal) : undefined
}

const SecondStep = (props) => {
  const { previousStep, submitting, invalid, handleSubmit } = props

  return (
    <Wrapper>
      <Header>
        <Text size='24px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.secondstep.reset' defaultMessage='Reset 2FA' />
        </Text>
        <Text size='10px'>
          <FormattedMessage id='scenes.reset2fa.secondstep.step2' defaultMessage='Step 2 of 3' />
        </Text>
      </Header>
      <Separator />
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel for='newEmail'>
              <FormattedMessage id='scenes.reset2fa.secondstep.newEmail' defaultMessage='New Email (Optional)' />
            </FormLabel>
            <Field name='newEmail' autoFocus validate={[validNullableEmail]} component={TextBox} />
            <InfoMsg size='12px' weight={300}>
              <FormattedMessage id='scenes.reset2fa.secondstep.newEmailExplain' defaultMessage="Enter your updated email if you've lost access to your previously verified email. If your 2FA reset request if approved, this will automatically be set as your wallet's new email address." />
            </InfoMsg>
          </FormItem>
        </FormGroup>
        <Footer>
          <BackLink onClick={previousStep} size='13px' weight={300}>
            <FormattedMessage id='scenes.reset2fa.secondstep.back' defaultMessage='Go Back' />
          </BackLink>
          <Button type='submit' nature='primary' uppercase disabled={submitting || invalid} >
            <FormattedMessage id='scenes.reset2fa.secondstep.continue' defaultMessage='Continue' />
          </Button>
        </Footer>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reset2FA', destroyOnUnmount: false })(SecondStep)
