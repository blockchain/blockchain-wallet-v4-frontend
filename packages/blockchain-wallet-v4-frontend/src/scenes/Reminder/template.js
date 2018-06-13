import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validEmail } from 'services/FormHelper'
import { Button, Link, Separator, Text, TextGroup } from 'blockchain-info-components'
import { CaptchaBox, Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const GoBackLink = styled(LinkContainer)`
  margin-right: 15px;
`
const SuccessMessages = styled(TextGroup)`
  margin: 25px 0;
`

const Reminder = (props) => {
  const { handleSubmit, timestamp, submitting, invalid, submitted } = props

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel for='email'>
              <FormattedMessage id='scenes.reminder.email' defaultMessage='Email' />
            </FormLabel>
            <Field name='email' autoFocus validate={[required, validEmail]} component={TextBox} />
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
        <Footer>
          <GoBackLink to='/help'>
            <Link size='13px' weight={300}>
              <FormattedMessage id='scenes.reminder.back' defaultMessage='Go Back' />
            </Link>
          </GoBackLink>
          <Button type='submit' nature='primary' uppercase disabled={submitting || invalid} onClick={onSubmit}>
            <FormattedMessage id='scenes.reminder.continue' defaultMessage='Continue' />
          </Button>
        </Footer>
      </Form>
    )
  }

  const renderReminder = () => {
    return (
      <React.Fragment>
        <SuccessMessages>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.reminder.thanks' defaultMessage='Thank you for submitting your request. If a wallet ID associated with this email address exists, you will receive an email with your ID shortly.' />
          </Text>
        </SuccessMessages>
        <LinkContainer to='/login'>
          <Button nature='primary' fullwidth uppercase>
            <FormattedMessage id='scenes.reminder.login' defaultMessage='Continue to Login' />
          </Button>
        </LinkContainer>
      </React.Fragment>
    )
  }

  return (
    <Wrapper>
      <Text size='24px' weight={300}>
        <FormattedMessage id='scenes.reminder.remind' defaultMessage='Remind Me' />
      </Text>
      <Text size='14px' weight={300}>
        <FormattedMessage id='scenes.reminder.explain' defaultMessage="Lost your wallet ID? We'll send it to you via your email." />
      </Text>
      <Separator />
      { submitted
        ? renderReminder()
        : renderForm()
      }

    </Wrapper>
  )
}

export default reduxForm({ form: 'reminder' })(Reminder)
