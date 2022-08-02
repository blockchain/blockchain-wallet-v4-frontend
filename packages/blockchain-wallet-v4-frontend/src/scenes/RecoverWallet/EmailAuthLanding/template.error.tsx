import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Error = ({ error }: Props) => {
  return (
    <Wrapper>
      <Icon color='error' name='close-circle' size='40px' />

      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        <FormattedMessage
          id='scenes.verifyemailtoken.error'
          defaultMessage='Something went wrong.'
        />
      </Text>
      <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
        {error}
      </Text>
      <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
        <FormattedMessage
          id='scenes.verifyaccountrecovery.error.tryagain'
          defaultMessage='Try again or contact support.'
        />
      </Text>

      <Link target='_blank' href='https://support.blockchain.com/'>
        <Button nature='primary' fullwidth style={{ marginTop: '16px' }} height='50px' data-e2e=''>
          <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
        </Button>
      </Link>
    </Wrapper>
  )
}

type Props = { error?: string }

export default Error
