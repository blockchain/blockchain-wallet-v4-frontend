import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'

const reveal = keyframes`
  0% { top: 30px; }
  15% { top: 0px; }
  25% { top: 0px; }
  50% { top: 0px; }
  75% { top: 0px; }
  85% { top: 0px; }
  100%: { top: -30px; }
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

const WhatsNewIcon = props => {
  const { handleResendVerifyEmail, reminded, val } = props
  const { email, emailVerified } = val

  return emailVerified ? null : (
    <Wrapper>
      <ItemWrapper>
        <Icon name='email' color='white' weight={600} />
        <Text
          style={{ marginLeft: '15px' }}
          color='white'
          size='14px'
          weight={200}
        >
          <FormattedMessage
            id='layouts.wallet.header.emailreminder'
            defaultMessage='Confirm your email address to properly secure your account'
          />
        </Text>
        <span>&nbsp;</span>
        <EmailSentNotification
          color='white'
          size='14px'
          weight={200}
          className={reminded ? 'active' : ''}
        >
          <FormattedMessage
            id='layouts.wallet.header.emailreminder.emailsent'
            defaultMessage='- An email was sent to {email}'
            values={{ email }}
          />
        </EmailSentNotification>
      </ItemWrapper>
      <ItemWrapper>
        <Action
          color='white'
          size='14px'
          weight={200}
          onClick={() => handleResendVerifyEmail(email)}
        >
          <FormattedMessage
            id='layouts.wallet.header.emailreminder.resend'
            defaultMessage='Resend Email'
          />
        </Action>
        <LinkContainer style={{ marginLeft: '15px' }} to='/security-center'>
          <Action color='white' size='14px' weight={200}>
            <FormattedMessage
              id='layouts.wallet.header.emailreminder.change'
              defaultMessage='Change Email'
            />
          </Action>
        </LinkContainer>
      </ItemWrapper>
    </Wrapper>
  )
}

WhatsNewIcon.propTypes = {
  handleClick: PropTypes.func.isRequired,
  highlighted: PropTypes.bool.isRequired
}

export default WhatsNewIcon
