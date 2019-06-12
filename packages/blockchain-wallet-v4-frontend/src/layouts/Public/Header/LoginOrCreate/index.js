import React from 'react'
import { contains } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Link, Text, TextGroup } from 'blockchain-info-components'
import media from 'services/ResponsiveService'

const LoginOrCreate = props => {
  const { pathname } = props.location
  const isSignup = contains('/signup', pathname)
  return (
    <LinkContainer to={isSignup ? '/login' : '/signup'}>
      <TextGroup inline>
        <Text size={media.mobile ? '12px' : '14px'} color='white' weight={500}>
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
        <Button
          nature='white-transparent'
          style={{ minWidth: '42px', marginLeft: '8px', borderWidth: '2px' }}
        >
          {isSignup ? (
            <Link
              size={media.mobile ? '12px' : '14px'}
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
            <Link
              size={media.mobile ? '12px' : '14px'}
              color='white'
              weight={600}
              data-e2e='signupLink'
            >
              <FormattedMessage
                id='layouts.public.register'
                defaultMessage='Create One Now'
              />
            </Link>
          )}
        </Button>
      </TextGroup>
    </LinkContainer>
  )
}

export default withRouter(LoginOrCreate)
