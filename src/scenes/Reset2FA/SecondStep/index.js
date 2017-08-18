import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Button, Link, Separator, Text } from 'blockchain-info-components'
import { Form, HelpBlock, TextBox } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: #FFFFFF;

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
  const { previous, next, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <FormattedMessage id='scenes.reset2fa.secondstep.reset' defaultMessage='Reset 2FA' />
        <Text size='10px'>
          <FormattedMessage id='scenes.reset2fa.secondstep.step2' defaultMessage='Step 2 of 3' />
        </Text>
      </Header>
      <FormattedMessage id='scenes.reset2fa.secondstep.explain4' defaultMessage='The process will be quicker with more precise details provided to us.' />
      <Separator />
      <Form>
        <FormattedMessage id='scenes.reset2fa.secondstep.newEmail' defaultMessage='New email' />
        <Field name='newEmail' component={TextBox} />
        <HelpBlock>
          <FormattedMessage id='scenes.reset2fa.secondstep.newEmail_explain' defaultMessage='If you lost access to the email associated with your wallet, enter a new email.' />
          <FormattedMessage id='scenes.reset2fa.secondstep.newEmail_explain2' defaultMessage='If the 2FA reset request is approved, this email will automatically be set as your new wallet email.' />
        </HelpBlock>
        <FormattedMessage id='scenes.reset2fa.secondstep.secretPhrase' defaultMessage='Secret phrase' />
        <Field name='secretPhrase' component={TextBox} />
        <HelpBlock>
          <FormattedMessage id='scenes.reset2fa.secondstep.secretPhrase_explain' defaultMessage='Enter your wallet Secret Phrase here if you have one set.' />
          <FormattedMessage id='scenes.reset2fa.secondstep.secretPhrase_explain2' defaultMessage='If the Secret Phrase is correct, your request will be approved much quicker.' />
          <FormattedMessage id='scenes.reset2fa.secondstep.secretPhrase_explain3' defaultMessage="If you don't know what this is, leave it blank." />
        </HelpBlock>
        <Button nature='secondary' fullwdith uppercase disabled={submitting || invalid} onClick={next}>
          <FormattedMessage id='scenes.reset2fa.secondstep.continue' defaultMessage='Continue' />
        </Button>
      </Form>
      <Footer>
        <Link onClick={previous}>
          <FormattedMessage id='scenes.reset2fa.secondstep.back' defaultMessage='Go back' />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default SecondStep
