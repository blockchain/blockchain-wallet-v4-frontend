import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Link, Separator, Text } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'

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
padding: 5px 0;
`

const SecondStep = (props) => {
  const { previousStep, submitting, invalid, onSubmit } = props

  return (
    <Wrapper>
      <Header>
        <Text size='30px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.secondstep.reset' defaultMessage='Reset 2FA' />
        </Text>
        <Text size='10px'>
          <FormattedMessage id='scenes.reset2fa.secondstep.step2' defaultMessage='Step 2 of 3' />
        </Text>
      </Header>
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.reset2fa.secondstep.explain' defaultMessage='The process will be quicker with more precise details provided to us.' />
      </Text>
      <Separator />
      <Form onSubmit={onSubmit}>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.reset2fa.secondstep.newEmail' defaultMessage='New email' />
        </Text>
        <Field name='newEmail' component={TextBox} />
        <Text size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.secondstep.newEmail_explain' defaultMessage='If you lost access to the email associated with your wallet, enter a new email.' />
          <FormattedMessage id='scenes.reset2fa.secondstep.newEmail_explain2' defaultMessage='If the 2FA reset request is approved, this email will automatically be set as your new wallet email.' />
        </Text>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.reset2fa.secondstep.secretPhrase' defaultMessage='Secret phrase' />
        </Text>
        <Field name='secretPhrase' component={TextBox} />
        <Text size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.secondstep.secretPhrase_explain' defaultMessage='Enter your wallet Secret Phrase here if you have one set. ' />
          <FormattedMessage id='scenes.reset2fa.secondstep.secretPhrase_explain2' defaultMessage='If the Secret Phrase is correct, your request will be approved much quicker. ' />
          <FormattedMessage id='scenes.reset2fa.secondstep.secretPhrase_explain3' defaultMessage="If you don't know what this is, leave it blank." />
        </Text>
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
