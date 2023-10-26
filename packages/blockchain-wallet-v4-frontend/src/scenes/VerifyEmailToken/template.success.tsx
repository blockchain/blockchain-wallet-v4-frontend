import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button, Padding } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { trackEvent } from 'data/analytics/slice'
import { Analytics } from 'data/types'
import { isMobile } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const APP_URL = 'https://blockchainwallet.page.link/dashboard'

const Success = () => {
  const dispatch = useDispatch()

  const returnToApp = () => {
    window.location.href = APP_URL
  }

  useEffect(() => {
    dispatch(
      trackEvent({
        key: Analytics.VERIFY_DEVICE_EMAIL_CONFIRMED,
        properties: {}
      })
    )
  }, [])

  return (
    <Wrapper>
      <Image name='email-verified' size='24px' />

      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        <FormattedMessage
          id='scenes.verifyemailtoken.verified'
          defaultMessage='Your email is verified!'
        />
      </Text>
      {isMobile() ? (
        <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
          <FormattedMessage
            id='scenes.verifyemailtoken.return_mobile_new'
            defaultMessage='Return to the app to access your Blockchain.com Account.'
          />
        </Text>
      ) : (
        <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
          <FormattedMessage
            id='scenes.verifyemailtoken.return_new'
            defaultMessage='Return to the previous tab to access your Blockchain.com Account.'
          />
        </Text>
      )}
      <Padding top={3} bottom={0.5}>
        <Button
          data-e2e='goBackToApp'
          width='full'
          variant='minimal'
          onClick={returnToApp}
          text={
            <Text color='blue600' size='16px' weight={600}>
              <FormattedMessage
                id='buttons.go_back_to_bc_app'
                defaultMessage='Go back to Blockchain.com App'
              />
            </Text>
          }
        />
      </Padding>
    </Wrapper>
  )
}

export default Success
