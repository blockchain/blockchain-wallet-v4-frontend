import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validEmail } from 'services/FormHelper'
import {
  Button,
  HeartbeatLoader,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import {
  CaptchaBox,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  TextBox
} from 'components/Form'
import { Wrapper } from 'components/Public'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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

const Reminder = props => {
  const {
    handleSubmit,
    timestamp,
    submitting,
    invalid,
    success,
    loading
  } = props

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel for='email'>
              <FormattedMessage
                id='scenes.reminder.email'
                defaultMessage='Email'
              />
            </FormLabel>
            <Field
              name='email'
              autoFocus
              validate={[required, validEmail]}
              component={TextBox}
            />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel for='code'>
              <FormattedMessage
                id='scenes.reminder.captcha'
                defaultMessage='Captcha'
              />
            </FormLabel>
            <Field
              name='code'
              validate={[required]}
              component={CaptchaBox}
              props={{ timestamp: timestamp }}
            />
          </FormItem>
        </FormGroup>
        <Footer>
          <GoBackLink to='/help'>
            <Link size='13px' weight={500}>
              <FormattedMessage
                id='scenes.reminder.back'
                defaultMessage='Go Back'
              />
            </Link>
          </GoBackLink>
          <Button
            type='submit'
            nature='primary'
            disabled={submitting || invalid || loading}
          >
            {loading ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage
                id='scenes.reminder.continue'
                defaultMessage='Continue'
              />
            )}
          </Button>
        </Footer>
      </Form>
    )
  }

  const renderReminder = () => {
    return (
      <React.Fragment>
        <SuccessMessages>
          <Text size='13px' weight={400}>
            <FormattedMessage
              id='scenes.reminder.thanks'
              defaultMessage='Thank you for submitting your request. If a wallet ID associated with this email address exists, you will receive an email with your ID shortly.'
            />
          </Text>
        </SuccessMessages>
        <LinkContainer to='/login'>
          <Button nature='primary' fullwidth>
            <FormattedMessage
              id='scenes.reminder.login'
              defaultMessage='Continue to Login'
            />
          </Button>
        </LinkContainer>
      </React.Fragment>
    )
  }

  return (
    <Wrapper>
      <Header>
        <Text size='20px' color='brand-primary' weight={600} capitalize>
          <FormattedMessage
            id='scenes.reminder.reminder'
            defaultMessage='Wallet ID Reminder'
          />
        </Text>
      </Header>
      {success ? renderReminder() : renderForm()}
    </Wrapper>
  )
}

export default reduxForm({ form: 'reminder' })(Reminder)
