import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { selectors } from 'data'
import { useRemote } from 'hooks'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const SofiErrorLanding = () => {
  return (
    <Wrapper>
      <ContentWrapper>
        <Image name='close-error' height='40px' />
        <Text size='20px' weight={600} color='black' lineHeight='1.5' style={{ marginTop: '8px' }}>
          <FormattedMessage
            id='scenes.sofi.signup.failure.generic.header'
            defaultMessage='Uh oh! Something went wrong.'
          />
        </Text>
        <Text
          color='grey900'
          lineHeight='1.5'
          style={{ marginBottom: '16px', marginTop: '8px' }}
          size='16px'
          weight={500}
        >
          <FormattedMessage
            id='scenes.sofi.signup.failure.expired.body'
            defaultMessage='Looks like there was an issue with your link. Restart your crypto account migration from your account on the SoFi website.'
          />
        </Text>
      </ContentWrapper>
    </Wrapper>
  )
}

export default SofiErrorLanding
