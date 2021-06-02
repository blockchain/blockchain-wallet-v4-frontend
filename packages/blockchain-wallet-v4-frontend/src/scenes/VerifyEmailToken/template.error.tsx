import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Error = ({ error }: Props) => {
  return (
    <Wrapper>
      {error && error.includes('already been verified') ? (
        <>
          <Icon color='success' name='checkmark-circle-filled' size='40px' />

          <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
            <FormattedMessage
              id='scenes.verifyemailtoken.error.alreadyverified.title'
              defaultMessage='Your email is already verified.'
            />
          </Text>
          <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
            <FormattedMessage
              id='scenes.verifyemailtoken.error.alreadyverified.message'
              defaultMessage='If this was not you, feel free to contact us.'
            />
          </Text>
        </>
      ) : (
        <>
          <Icon color='error' name='close-circle' size='40px' />

          <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
            <FormattedMessage
              id='scenes.verifyemailtoken.error'
              defaultMessage='Something went wrong.'
            />
          </Text>
          <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
            <FormattedMessage
              id='scenes.verifyemailtoken.error.tryagain'
              defaultMessage='Try logging in again or contact support.'
            />
          </Text>
        </>
      )}
      <Link target='_blank' href='https://support.blockchain.com/'>
        <Button nature='primary' fullwidth style={{ marginTop: '16px' }} height='50px' data-e2e=''>
          <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
        </Button>
      </Link>
    </Wrapper>
  )
}

type Props = { error: string }

export default Error
