import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required, validEmail } from 'services/FormHelper'
import { Button, Form, Separator, TextBox } from 'blockchain-info-components'
import RouterLink from 'components/RouterLink'
import { CaptchaBox } from 'components/Form'

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
      <FormattedMessage id='scenes.reminder.remind' defaultMessage='Remind me' />
      <FormattedMessage id='scenes.reminder.explain' defaultMessage="Lost your Wallet Identifier? We'll send it to you via your email." />
      <Separator />
      <Form>
        <FormattedMessage id='scenes.reminder.email' defaultMessage='Email' />
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <FormattedMessage id='scenes.reminder.captcha' defaultMessage='Captcha' />
        <Field name='captcha' validate={[required]} component={CaptchaBox} props={{ timestamp: timestamp }} />
        <Button type='secondary' fullwidth uppercase disabled={submitting || invalid} onClick={handleClick}>
          <FormattedMessage id='scenes.reminder.continue' defaultMessage='Continue' />
        </Button>
      </Form>
      <Footer>
        <RouterLink to='/help'>
          <FormattedMessage id='scenes.reminder.back' defaultMessage='Go back' />
        </RouterLink>
      </Footer>
    </Wrapper>
  )
}

export default Reminder
