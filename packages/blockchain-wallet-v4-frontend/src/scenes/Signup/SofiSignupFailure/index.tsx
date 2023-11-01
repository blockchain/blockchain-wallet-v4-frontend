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

const MigrationExpired = () => {
  // Add check here to make sure that there is wallet data
  // route should navigate to login if there's no wallet data
  const backToSofi = () => {}

  return (
    <Wrapper>
      <ContentWrapper>
        <Image name='offline' height='40px' />

        <Text size='20px' weight={600} color='black' lineHeight='1.5' style={{ marginTop: '8px' }}>
          <FormattedMessage
            id='scenes.sofi.signup.failure.expired.header'
            defaultMessage='Uh oh! Your migration link expired.'
          />
        </Text>
        <>
          <Text
            color='grey900'
            lineHeight='1.5'
            style={{ marginBottom: '16px', marginTop: '8px' }}
            size='16px'
            weight={500}
          >
            <FormattedMessage
              id='scenes.sofi.signup.failure.expired.body'
              defaultMessage='Restart your crypto account migration from your account on the SoFi website.'
            />
          </Text>
          <Button data-e2e='viewAccount' fullwidth nature='primary' onClick={backToSofi}>
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage id='buttons.go_to_sofi' defaultMessage='Go to SoFi account' />
            </Text>
          </Button>
        </>
      </ContentWrapper>
    </Wrapper>
  )
}

export default MigrationExpired
