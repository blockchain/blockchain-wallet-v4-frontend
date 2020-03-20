import { Button, Link, Text, TextGroup } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { includes } from 'ramda'
import { LinkContainer } from 'react-router-bootstrap'
import { withRouter } from 'react-router-dom'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const ResponsiveText = styled(Text)`
  font-size: 14px;
  ${media.mobile`
    font-size: 12px;
  `}
`
const ResponsiveLink = styled(Link)`
  font-size: 14px;
  ${media.mobile`
    font-size: 12px;
  `}
`

const LoginOrCreate = props => {
  const { pathname } = props.location
  const isSignup = includes('/signup', pathname)
  return (
    <LinkContainer to={isSignup ? '/login' : '/signup'}>
      <TextGroup inline>
        <ResponsiveText color='white' weight={500}>
          {isSignup ? (
            <FormattedMessage
              id='layouts.public.alreadyhave_1'
              defaultMessage='Already have a Wallet?'
            />
          ) : (
            <FormattedMessage
              id='layouts.public.donthave_1'
              defaultMessage="Don't have a Wallet?"
            />
          )}
        </ResponsiveText>
        <Button
          nature='white-blue'
          style={{ minWidth: '94px', marginLeft: '22px', borderRadius: '8px' }}
        >
          {isSignup ? (
            <ResponsiveLink weight={600} data-e2e='signupLinkToLogin'>
              <FormattedMessage
                id='layouts.public.login'
                defaultMessage='Log In'
              />
            </ResponsiveLink>
          ) : (
            <ResponsiveLink weight={600} data-e2e='signupLink'>
              <FormattedMessage
                id='layouts.public.register'
                defaultMessage='Create One Now'
              />
            </ResponsiveLink>
          )}
        </Button>
      </TextGroup>
    </LinkContainer>
  )
}

export default withRouter(LoginOrCreate)
