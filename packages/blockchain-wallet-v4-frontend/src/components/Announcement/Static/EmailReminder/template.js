import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'

const reveal = keyframes`
  0% { top: 30px; }
  15% { top: 0; }
  25% { top: 0; }
  50% { top: 0; }
  75% { top: 0; }
  85% { top: 0; }
  100% { top: -30px; }
`

const Wrapper = styled.div`
  display: flex;
  padding: 12px 25px;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme['marketing-primary']};
  overflow: hidden;
  ${media.mobile`
    display: none;
  `};
`

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
`
const Action = styled(Text)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`
const EmailSentNotification = styled(Text)`
  &.active {
    animation: ${reveal} 3s 1;
  }
  position: relative;
  top: -30px;
  @media (max-width: 1023px) {
    display: none;
  }
`

const EmailReminder = props => {
  const { handleResendVerifyEmail, reminded, email } = props

  return (
    <Wrapper>
      <ItemWrapper>
        <Icon name='email' color='white' weight={600} />
        <Text
          style={{ marginLeft: '15px' }}
          color='white'
          size='14px'
          weight={300}
        >
          <FormattedMessage
            id='layouts.wallet.header.announcements.emailreminder'
            defaultMessage='Confirm your email address to properly secure your account'
          />
        </Text>
        <span>&nbsp;</span>
        <EmailSentNotification
          color='white'
          size='14px'
          weight={300}
          className={reminded ? 'active' : ''}
        >
          <FormattedMessage
            id='layouts.wallet.header.announcements.emailreminder.emailsent'
            defaultMessage='- An email was sent to {email}'
            values={{ email }}
          />
        </EmailSentNotification>
      </ItemWrapper>
      <ItemWrapper>
        <Action
          color='white'
          size='14px'
          weight={300}
          onClick={() => handleResendVerifyEmail(email)}
        >
          <FormattedMessage
            id='layouts.wallet.header.announcements.emailreminder.resend'
            defaultMessage='Resend Email'
          />
        </Action>
        <LinkContainer
          style={{ marginLeft: '15px' }}
          to={{ pathname: '/security-center', state: { changeEmail: true } }}
        >
          <Action color='white' size='14px' weight={300}>
            <FormattedMessage
              id='layouts.wallet.header.announcements.emailreminder.change'
              defaultMessage='Change Email'
            />
          </Action>
        </LinkContainer>
      </ItemWrapper>
    </Wrapper>
  )
}

EmailReminder.propTypes = {
  email: PropTypes.string.isRequired,
  reminded: PropTypes.bool.isRequired,
  handleResendVerifyEmail: PropTypes.func.isRequired
}

export default EmailReminder
