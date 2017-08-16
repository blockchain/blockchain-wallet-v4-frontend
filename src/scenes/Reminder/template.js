import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { required, validEmail } from 'services/FormHelper'
import { Form, RouterLink, SecondaryButton, Separator, Text, TextBox } from 'blockchain-info-components'
import { CaptchaBox } from 'components/shared/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: #FFFFFF;

  @media(min-width: 768px) { width: 550px; }
`
const Footer = styled.div`
  padding: 5px 0;
`

const Reminder = (props) => {
  const { handleClick, timestamp, submitting, invalid } = props

  return (
    <Wrapper>
      <Text id='scenes.reminder.remind' text='Remind me' biggest light capitalize />
      <Text id='scenes.reminder.explain' text="Lost your Wallet Identifier? We'll send it to you via your email." small light altFont />
      <Separator />
      <Form>
        <Text id='scenes.reminder.email' text='Email' small medium />
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <Text id='scenes.reminder.captcha' text='Captcha' small medium />
        <Field name='captcha' validate={[required]} component={CaptchaBox} props={{ timestamp: timestamp }} />
        <SecondaryButton disabled={submitting || invalid} onClick={handleClick} fullwidth>
          <Text id='scenes.reminder.continue' text='Continue' uppercase white />
        </SecondaryButton>
      </Form>
      <Footer>
        <RouterLink to='/help'><Text id='scenes.reminder.back' text='Go back' small light cyan /></RouterLink>
      </Footer>
    </Wrapper>
  )
}

export default Reminder
