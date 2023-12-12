import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { useRemote } from 'hooks'
import { isMobile } from 'services/styles'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const MigrationError = () => {
  // Add check here to make sure that there is wallet data
  // route should navigate to login if there's no wallet data
  const backToSofi = () => {}

  const {
    data: isMigrated,
    hasError: isAssociatedError,
    isLoading: isAssociatedLoading
  } = useRemote(selectors.modules.profile.getSofiAssociateNabuUserStatus)

  return (
    <Wrapper>
      <ContentWrapper>
        <Image name='close-error' height='40px' />

        <Text size='20px' weight={600} color='black' lineHeight='1.5' style={{ marginTop: '8px' }}>
          {isAssociatedError ? (
            <FormattedMessage
              id='scenes.sofi.signup.failure.generic.header'
              defaultMessage='Uh oh! Something went wrong.'
            />
          ) : (
            <FormattedMessage
              id='scenes.sofi.signup.failure.expired.header'
              defaultMessage='Uh oh! Your migration link expired.'
            />
          )}
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

export default MigrationError
