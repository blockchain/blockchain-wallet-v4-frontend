import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

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
import { required, validEmail } from 'services/forms'

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

const Reminder = (props: InjectedFormProps<{}, Props> & Props) => {
  const { handleSubmit, invalid, loading, submitting, success } = props

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='email'>
              <FormattedMessage
                id='scenes.reminder.email'
                defaultMessage='Email'
              />
            </FormLabel>
            <Field
              bgColor='grey000'
              name='email'
              autoFocus
              validate={[required, validEmail]}
              component={TextBox}
            />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='code'>
              <FormattedMessage
                id='scenes.reminder.captcha'
                defaultMessage='Captcha'
              />
            </FormLabel>
            <Field
              bgColor='grey000'
              name='code'
              validate={[required]}
              component={CaptchaBox}
            />
          </FormItem>
        </FormGroup>
        <Footer>
          <GoBackLink to='/help'>
            <Link size='13px' weight={500}>
              <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
            </Link>
          </GoBackLink>
          <Button
            type='submit'
            nature='primary'
            data-e2e='reminderContinue'
            disabled={submitting || invalid || loading}
          >
            {loading ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage
                id='buttons.continue'
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
          <Button data-e2e='continueToLogin' nature='primary' fullwidth>
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
        <Text size='20px' color='blue900' weight={600} capitalize>
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

type Props = {
  loading: boolean
  success: boolean
}

export default reduxForm<{}, Props>({ form: 'reminder' })(Reminder)
