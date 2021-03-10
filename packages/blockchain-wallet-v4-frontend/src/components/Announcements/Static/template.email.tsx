import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const revealFrames = keyframes`
  0% { top: 30px; }
  15% { top: 0; }
  25% { top: 0; }
  50% { top: 0; }
  75% { top: 0; }
  85% { top: 0; }
  100% { top: -100px; }
`
const revealAnimation = css`
  animation: ${revealFrames} 3s 1;
`
const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
`
const Action = styled(Text)`
  cursor: pointer;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`
const EmailSentNotification = styled(Text)<{ className?: string }>`
  &.active {
    ${revealAnimation};
  }
  position: relative;
  top: -100px;
  ${media.laptop`
    display: none;
  `}
`

const EmailReminder = props => {
  const { email, emailReminded, onEmailResend } = props

  return (
    <>
      <ItemWrapper>
        <Icon name='email' color='white' size='24px' />
        <Text
          style={{ marginLeft: '12px', marginBottom: '1px' }}
          color='white'
          size='14px'
          weight={500}
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
          className={emailReminded ? 'active' : ''}
          weight={500}
        >
          <FormattedMessage
            id='layouts.wallet.header.announcements.emailreminder.emailsent'
            defaultMessage='- An email was sent to {email}'
            values={{ email }}
          />
        </EmailSentNotification>
      </ItemWrapper>
      <ItemWrapper>
        <Action color='white' size='14px' onClick={() => onEmailResend(email)}>
          <FormattedMessage
            id='layouts.wallet.header.announcements.emailreminder.resend'
            defaultMessage='Resend Email'
          />
        </Action>
        <LinkContainer
          style={{ marginLeft: '15px' }}
          to={{ pathname: '/security-center', state: { changeEmail: true } }}
        >
          <Action color='white' size='14px'>
            <FormattedMessage
              id='layouts.wallet.header.announcements.emailreminder.change'
              defaultMessage='Change Email'
            />
          </Action>
        </LinkContainer>
      </ItemWrapper>
    </>
  )
}

EmailReminder.propTypes = {
  email: PropTypes.string.isRequired,
  emailReminded: PropTypes.bool,
  onEmailResend: PropTypes.func.isRequired
}

export default EmailReminder
