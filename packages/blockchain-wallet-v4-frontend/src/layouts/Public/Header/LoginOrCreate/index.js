import React from 'react'
import { contains } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, Text, TextGroup } from 'blockchain-info-components'

const LoginOrCreate = props => {
  const { pathname } = props.location
  const isSignup = contains('/signup', pathname)
  return (
    <LinkContainer to={isSignup ? '/login' : '/signup'}>
      <TextGroup inline>
        <Text size='14px' color='white' weight={500}>
          {isSignup ? (
            <FormattedMessage
              id='layouts.public.alreadyhave'
              defaultMessage='Already have a wallet?'
            />
          ) : (
            <FormattedMessage
              id='layouts.public.donthave'
              defaultMessage="Don't have a wallet?"
            />
          )}
        </Text>
        {isSignup ? (
          <Link
            size='14px'
            color='white'
            weight={600}
            data-e2e='signupLinkToLogin'
          >
            <FormattedMessage
              id='layouts.public.login'
              defaultMessage='Log In'
            />
          </Link>
        ) : (
          <Link size='14px' color='white' weight={600} data-e2e='signupLink'>
            <FormattedMessage
              id='layouts.public.register'
              defaultMessage='Create One Now'
            />
          </Link>
        )}
      </TextGroup>
    </LinkContainer>
  )
}

export default withRouter(LoginOrCreate)
