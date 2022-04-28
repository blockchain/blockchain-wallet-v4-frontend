import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const ErrorWrapper = styled(Wrapper)`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Error = ({ error }: Props) => {
  return (
    <ErrorWrapper>
      <Icon color='error' name='close-circle' size='40px' />
      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        <FormattedMessage
          id='scenes.verifyemailtoken.error'
          defaultMessage='Something went wrong.'
        />
      </Text>
      {error && (
        <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
          {error}
        </Text>
      )}
      <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
        <FormattedMessage
          id='scenes.verifyemailtoken.error.tryagain'
          defaultMessage='Try logging in again or contact support.'
        />
      </Text>
      <LinkContainer to='/login' style={{ margin: '16px 0 8px' }}>
        <Button height='40px' nature='primary' data-e2e='login'>
          <Text color='white' size='16px' weight={600}>
            <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
          </Text>
        </Button>
      </LinkContainer>
      <Link target='_blank' href='https://support.blockchain.com/' data-e2e='contactSupport'>
        <Text color='blue600' size='16px' weight={500}>
          <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
        </Text>
      </Link>
    </ErrorWrapper>
  )
}

type Props = { error?: string }

export default Error
