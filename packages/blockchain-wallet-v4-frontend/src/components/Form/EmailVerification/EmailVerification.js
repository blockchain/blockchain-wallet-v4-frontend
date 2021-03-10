import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import TextBox from '../TextBox'

const Container = styled.div``

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const InputRow = styled(Row)`
  button {
    border-radius: 0;
  }
  ${media.mobile`
    flex-direction: column;
  `};
  input {
    ${media.atLeastMobile`
      border-right: none;
    `}
  }
`

export const LoadingButton = ({ children, loading, ...rest }) => (
  <Button height='48px' disabled={loading} {...rest}>
    {loading ? (
      <HeartbeatLoader height='20px' width='20px' color='white' />
    ) : (
      children
    )}
  </Button>
)

export const ChangeButton = styled(LoadingButton)`
  margin-right: 16px;
  ${media.mobile`
    margin-right: 0;
    margin-bottom: 16px;
  `};
`

const EmailLabel = styled(Text)`
  margin-bottom: 32px;
  word-break: break-all;
  ${media.mobile`
    margin-bottom: 16px;
  `};
`

const SuccessLabel = styled(Text)`
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  > :first-child {
    margin-right: 8px;
  }
`

const Verified = ({ className, email }) => (
  <Container className={className}>
    <SuccessLabel color='success'>
      <FormattedMessage
        id='components.EmailVerification.emailverified'
        defaultMessage='Email Verified'
      />
      <Icon name='check' weight='400' size='13px' color='success' />
    </SuccessLabel>
    <EmailLabel weight='400'>{email}</EmailLabel>
  </Container>
)

const EmailSent = ({
  changeEmail,
  className,
  email,
  loading,
  sendVerification
}) => (
  <Container className={className}>
    <Text weight='300'>
      <FormattedMessage
        id='components.EmailVerification.checkinbox'
        defaultMessage='Check your inbox. We sent an email to:'
      />
    </Text>
    <EmailLabel weight='400'>{email}</EmailLabel>
    <InputRow>
      <ChangeButton nature='primary' onClick={changeEmail} loading={loading}>
        <FormattedMessage
          id='components.EmailVerification.changeemail'
          defaultMessage='Change Email'
        />
      </ChangeButton>
      <LoadingButton
        nature='primary'
        onClick={sendVerification}
        loading={loading}
      >
        <FormattedMessage
          id='components.EmailVerification.sendemailagain'
          defaultMessage='Send Again'
        />
      </LoadingButton>
    </InputRow>
  </Container>
)

const EmailInput = ({
  className,
  errorBottom,
  input,
  label,
  loading,
  meta,
  updateEmail
}) => (
  <Container className={className}>
    {label && (
      <label htmlFor='email'>
        <FormattedMessage
          id='components.EmailVerification.label'
          defaultMessage='Enter Your Email Address'
        />
      </label>
    )}
    <InputRow>
      <TextBox
        errorBottom={errorBottom}
        placeholder={'satoshi@blockchain.com'}
        input={input}
        meta={meta}
      />
      <LoadingButton nature='primary' onClick={updateEmail} loading={loading}>
        <FormattedMessage
          id='components.EmailVerification.sendnow'
          defaultMessage='Send Now'
        />
      </LoadingButton>
    </InputRow>
  </Container>
)

export default class EmailVerification extends React.PureComponent {
  sendVerification = () => {
    this.props.onVerificationSend(this.props.input.value)
  }

  updateEmail = () => {
    this.props.onUpdate(this.props.input.value)
  }

  changeEmail = () => {
    this.props.onEdit()
  }

  render() {
    const { changeEmail, sendVerification, updateEmail } = this
    const {
      className,
      errorBottom,
      input,
      label,
      loading,
      meta,
      verificationSent,
      verified
    } = this.props
    const email = input.value

    if (verified) return <Verified {...{ email, className }} />
    if (verificationSent)
      return (
        <EmailSent
          {...{
            email,
            sendVerification,
            changeEmail,
            className,
            loading
          }}
        />
      )
    return (
      <EmailInput
        {...{
          input,
          meta,
          updateEmail,
          className,
          errorBottom,
          label,
          loading
        }}
      />
    )
  }
}
