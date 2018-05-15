import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

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
const Footer = styled.div`
  margin-top: 20px;
`

const SecondStep = (props) => {
  const { previousStep, submitting, invalid, onSubmit } = props

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
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel for='newEmail'>
              <FormattedMessage id='scenes.reset2fa.secondstep.newEmail' defaultMessage='New email' />
            </FormLabel>
            <Field name='newEmail' autoFocus component={TextBox} />
            <Text size='12px' weight={300}>
              <FormattedMessage id='scenes.reset2fa.secondstep.newEmail_explain' defaultMessage='If you lost access to the email associated with your wallet, enter a new email.' />
              <FormattedMessage id='scenes.reset2fa.secondstep.newEmail_explain2' defaultMessage='If the 2FA reset request is approved, this email will automatically be set as your new wallet email.' />
            </Text>
          </FormItem>
        </FormGroup>
        <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid} >
          <FormattedMessage id='scenes.reset2fa.secondstep.continue' defaultMessage='Continue' />
        </Button>
      </Form>
      <Footer>
        <Link onClick={previousStep} size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.secondstep.back' defaultMessage='Go Back' />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reset2FA', destroyOnUnmount: false })(SecondStep)
