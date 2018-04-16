import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validEmail } from 'services/FormHelper'
import { Button, Link, Separator, Text } from 'blockchain-info-components'
import { CaptchaBox, Form, TextBox } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Footer = styled.div`
  padding: 5px 0;
`

const Reminder = (props) => {
  const { onSubmit, timestamp, submitting, invalid } = props

  return (
    <Wrapper>
      <Text size='30px' weight={300}>
        <FormattedMessage id='scenes.reminder.remind' defaultMessage='Remind Me' />
      </Text>
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.reminder.explain' defaultMessage="Lost your Wallet Identifier? We'll send it to you via your email." />
      </Text>
      <Separator />
      <Form onSubmit={onSubmit}>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.reminder.email' defaultMessage='Email' />
        </Text>
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.reminder.captcha' defaultMessage='Captcha' />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage id='scenes.reminder.robot' defaultMessage="So that we know you're not a robot" />
        </Text>
        <Field name='code' validate={[required]} component={CaptchaBox} props={{ timestamp: timestamp }} />
        <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid} onClick={onSubmit}>
          <FormattedMessage id='scenes.reminder.continue' defaultMessage='Continue' />
        </Button>
      </Form>
      <Footer>
        <LinkContainer to='/help'>
          <Link size='13px' weight={300}>
            <FormattedMessage id='scenes.reminder.back' defaultMessage='Go Back' />
          </Link>
        </LinkContainer>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reminder' })(Reminder)
