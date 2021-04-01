import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { isMobile } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Success = ({ mobileLinkOut }: Props) => {
  return (
    <Wrapper>
      <LogoWrapper>
        <Image name='email-success' width='75px' height='75px' />
      </LogoWrapper>
      <Text
        size='18px'
        weight={500}
        color='marketing-primary'
        style={{ marginTop: '15px' }}
      >
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
            style={{ marginTop: '20px' }}
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
        <Text style={{ marginTop: '16px' }} size='15px' weight={400}>
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
