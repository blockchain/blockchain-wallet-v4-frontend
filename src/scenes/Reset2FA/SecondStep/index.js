import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { Form, HelpBlock, Link, SecondaryButton, Separator, Text, TextBox } from 'blockchain-components'

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
        <Text id='scenes.reset2fa.secondstep.reset' text='Reset 2FA' biggest light capitalize />
        <Text id='scenes.reset2fa.secondstep.step2' text='Step 2 of 3' smallest />
      </Header>
      <Text id='scenes.reset2fa.secondstep.explain4' text='The process will be quicker with more precise details provided to us.' small light altFont />
      <Separator />
      <Form>
        <Text id='scenes.reset2fa.secondstep.newEmail' text='New email' small medium capitalize />
        <Field name='newEmail' component={TextBox} />
        <HelpBlock>
          <Text id='scenes.reset2fa.secondstep.newEmail_explain' text='If you lost access to the email associated with your wallet, enter a new email.' small light altFont />
          <Text id='scenes.reset2fa.secondstep.newEmail_explain2' text='If the 2FA reset request is approved, this email will automatically be set as your new wallet email.' small light altFont />
        </HelpBlock>
        <Text id='scenes.reset2fa.secondstep.secretPhrase' text='Secret phrase' small medium capitalize />
        <Field name='secretPhrase' component={TextBox} />
        <HelpBlock>
          <Text id='scenes.reset2fa.secondstep.secretPhrase_explain' text='Enter your wallet Secret Phrase here if you have one set.' small light altFont />
          <Text id='scenes.reset2fa.secondstep.secretPhrase_explain2' text='If the Secret Phrase is correct, your request will be approved much quicker.' small light altFont />
          <Text id='scenes.reset2fa.secondstep.secretPhrase_explain3' text="If you don't know what this is, leave it blank." small light altFont />
        </HelpBlock>
        <SecondaryButton disabled={submitting || invalid} onClick={next} fullwidth>
          <Text id='scenes.reset2fa.secondstep.continue' text='Continue'uppercase white />
        </SecondaryButton>
      </Form>
      <Footer>
        <Link onClick={previous}><Text id='scenes.reset2fa.secondstep.back' text='Go back' small light cyan /></Link>
      </Footer>
    </Wrapper>
  )
}

export default SecondStep
