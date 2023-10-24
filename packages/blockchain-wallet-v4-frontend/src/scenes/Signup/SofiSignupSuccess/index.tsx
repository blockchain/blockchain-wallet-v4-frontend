import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { isMobile } from 'services/styles'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const SofiSuccess = () => {
  // Add check here to make sure that there is wallet data
  // route should navigate to login if there's no wallet data
  const sofiWalletRedirect = () => {}
  return (
    <Wrapper>
      <ContentWrapper>
        <Image name='checkmark-circle-green' height='40px' />

        <Text size='20px' weight={600} color='black' lineHeight='1.5' style={{ marginTop: '8px' }}>
          <FormattedMessage id='scenes.sofi.signup.success' defaultMessage='You’re all set!' />
        </Text>
        <Text
          color='grey900'
          lineHeight='1.5'
          style={{ marginBottom: '16px', marginTop: '8px' }}
          size='16px'
          weight={500}
        >
          <FormattedMessage
            id='scenes.sofi.signup.success.title'
            defaultMessage='Your account was successfully created. Your crypto balances have been migrated.'
          />
        </Text>
        <Button data-e2e='viewAccount' fullwidth nature='primary' onClick={sofiWalletRedirect}>
          <Text color='white' size='16px' weight={600}>
            <FormattedMessage id='buttons.view_my_account' defaultMessage='View my account' />
          </Text>
        </Button>
      </ContentWrapper>
    </Wrapper>
  )
}

export default SofiSuccess
