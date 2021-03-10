import React, { useState } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled, { DefaultTheme } from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  Text
} from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, FormGroup, FormItem, TextBox } from 'components/Form'
import { model } from 'data'
import { required, validEmail } from 'services/forms'

import { Props as OwnProps } from '.'

const { SB_CHANGE_EMAIL_FORM } = model.components.simpleBuy

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const IconWrapper = styled.div<{ color: keyof DefaultTheme }>`
  display: flex;
  background: ${props => props.theme[props.color]};
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 20px;
`

const CloseContainer = styled.div`
  display: flex;
  align-items: right;
  justify-content: flex-end;
`
const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  padding: 0 40px;
  flex: 1;
  justify-content: center;
`

const Content = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  height: 250px;
  width: 100%;
`

const ResendContiner = styled.span`
  display: inline;
  padding: 40px;
  text-align: center;
`
const CustomForm = styled(Form)`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`

export const Label = styled.label`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 12px;
  display: block;
  text-align: left;
`

const Template: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const [changeEmail, setChangeEmail] = useState(false)

  return (
    <Wrapper>
      <FlyoutWrapper>
        <CloseContainer>
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.handleClose}
          />
        </CloseContainer>
      </FlyoutWrapper>

      <ContentWrapper>
        <Content>
          <IconWrapper color='blue600'>
            <Icon color='white' name='email' size='24px' />
          </IconWrapper>
          <Text
            size='20px'
            weight={600}
            color='black'
            style={{ marginTop: '8px' }}
          >
            {changeEmail ? (
              <FormattedMessage
                id='modals.simplebuy.verifyemail.change_your_email'
                defaultMessage='Change Your Email Address'
              />
            ) : (
              <FormattedMessage
                id='scenes.verifyemail.title'
                defaultMessage='Verify Your Email'
              />
            )}
          </Text>

          {changeEmail ? (
            <CustomForm onSubmit={props.handleSubmit}>
              <FormGroup>
                <FormItem>
                  <Label htmlFor='email'>
                    <Text weight={500} size='14px'>
                      <FormattedMessage
                        id='modals.simplebuy.verifyemail.email_address'
                        defaultMessage='Email Address'
                      />
                    </Text>
                  </Label>
                  <Field
                    name='email'
                    component={TextBox}
                    validate={[required, validEmail]}
                    verified={props.isEmailVerified}
                    errorBottom
                  />
                </FormItem>
              </FormGroup>
              <Button
                data-e2e='submitSBInforAndResidential'
                height='48px'
                size='16px'
                nature='primary'
                type='submit'
                fullwidth
              >
                {props.submitting ? (
                  <HeartbeatLoader height='16px' width='16px' color='white' />
                ) : (
                  <FormattedMessage
                    id='modals.simplebuy.verifyemail.save_and_verify'
                    defaultMessage='Save & Verify'
                  />
                )}
              </Button>
            </CustomForm>
          ) : (
            <>
              <Text
                color='grey900'
                style={{ marginTop: '8px' }}
                size='16px'
                weight={500}
              >
                <FormattedHTMLMessage
                  id='scenes.verifyemail.description'
                  defaultMessage='We sent a verification email to: <b>{email}</b>. Please click the link in the email to continue.'
                  values={{
                    email: props.email
                  }}
                />
              </Text>
              <Link
                onClick={() => setChangeEmail(true)}
                size='16px'
                style={{ marginTop: '40px' }}
                weight={500}
                data-e2e='changeVerifyEmail'
                color='blue600'
              >
                <FormattedMessage
                  id='modals.simplebuy.verifyemail.change_email'
                  defaultMessage='Change Email Address'
                />
              </Link>
            </>
          )}
        </Content>
      </ContentWrapper>
      {!changeEmail && (
        <ResendContiner>
          <Text
            color='grey900'
            style={{ marginRight: '2px', display: 'inline-block' }}
            size='16px'
            weight={500}
          >
            <FormattedMessage
              id='modals.simplebuy.verifyemail.dint_get'
              defaultMessage='Didn’t get the email?'
            />
          </Text>

          <Link
            onClick={() => props.resendEmail(props.email)}
            size='16px'
            style={{ marginTop: '40px' }}
            weight={500}
            data-e2e='resendVerifyEmail'
            color='blue600'
          >
            <FormattedMessage
              id='modals.simplebuy.verifyemail.resend'
              defaultMessage='Resend'
            />
          </Link>
        </ResendContiner>
      )}
    </Wrapper>
  )
}

type Props = OwnProps & {
  email: string
  resendEmail: (email: string) => void
}

export default reduxForm<{}, Props>({
  form: SB_CHANGE_EMAIL_FORM,
  destroyOnUnmount: false
})(Template)
