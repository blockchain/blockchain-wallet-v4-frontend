import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validEmail } from 'services/FormHelper'
import { Button, Link, Separator, Text } from 'blockchain-info-components'
import { CaptchaBox, Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Footer = styled.div`
  margin-top: 20px;
`

const Reminder = (props) => {
  const { onSubmit, timestamp, submitting, invalid } = props

  return (
    <Wrapper>
      <Text size='24px' weight={300}>
        <FormattedMessage id='scenes.reminder.remind' defaultMessage='Remind Me' />
      </Text>
      <Text size='14px' weight={300}>
        <FormattedMessage id='scenes.reminder.explain' defaultMessage="Lost your Wallet Identifier? We'll send it to you via your email." />
      </Text>
      <Separator />
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel for='email'>
              <FormattedMessage id='scenes.reminder.email' defaultMessage='Email' />
            </FormLabel>
            <Field name='email' validate={[required, validEmail]} component={TextBox} />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel for='code'>
              <FormattedMessage id='scenes.reminder.captcha' defaultMessage='Captcha' />
            </FormLabel>
            <Field name='code' validate={[required]} component={CaptchaBox} props={{ timestamp: timestamp }} />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid} onClick={onSubmit}>
              <FormattedMessage id='scenes.reminder.continue' defaultMessage='Continue' />
            </Button>
          </FormItem>
        </FormGroup>
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
