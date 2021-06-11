import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { isMobile } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Success = ({ mobileLinkOut }: Props) => {
  return (
    <Wrapper>
      <Icon color='success' name='checkmark-circle-filled' size='40px' />

      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        <FormattedMessage
          id='scenes.verifyemailtoken.verified'
          defaultMessage='Your email is verified!'
        />
      </Text>
      {isMobile() ? (
        <Link href={mobileLinkOut}>
          <Button
            nature='primary'
            fullwidth
            style={{ marginTop: '16px' }}
            height='50px'
            data-e2e=''
          >
            <FormattedMessage
              id='scenes.verifyemailtoken.mobile.openwallet'
              defaultMessage='Open My Wallet'
            />
          </Button>
        </Link>
      ) : (
        <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
          <FormattedMessage
            id='scenes.verifyemailtoken.return'
            defaultMessage='Return to the previous tab to access your Blockchain Wallet.'
          />
        </Text>
      )}
    </Wrapper>
  )
}

type Props = {
  mobileLinkOut: string
}

export default Success
