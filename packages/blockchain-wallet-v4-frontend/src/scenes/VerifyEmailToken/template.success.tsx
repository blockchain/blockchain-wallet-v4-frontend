import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Padding } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { isMobile } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const APP_URL = 'https://blockchainwallet.page.link/dashboard'

const Success = () => {
  const returnToApp = () => {
    window.location.href = APP_URL
  }

  return (
    <Wrapper>
      <Image name='email-verified' size='24px' />

      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        <FormattedMessage id='scenes.verifyemailtoken.verified' defaultMessage='Email Verified' />
      </Text>
      {isMobile() ? (
        <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
          <FormattedMessage
            id='scenes.verifyemailtoken.return_mobile_new'
            defaultMessage='Continue to the Blockchain.com app to access your account'
          />
        </Text>
      ) : (
        <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
          <FormattedMessage
            id='scenes.verifyemailtoken.return_new'
            defaultMessage='You can safely close this tab or page. Go back to the other Blockchain.com tab or page to continue.'
          />
        </Text>
      )}
      {isMobile() && (
        <Padding top={3} bottom={0.5}>
          <Button
            data-e2e='goBackToApp'
            width='full'
            variant='minimal'
            onClick={returnToApp}
            text={
              <Text color='blue600' size='16px' weight={600}>
                <FormattedMessage
                  id='buttons.go_to_bc_app'
                  defaultMessage='Continue to Blockchain.com App'
                />
              </Text>
            }
          />
        </Padding>
      )}
    </Wrapper>
  )
}

export default Success
