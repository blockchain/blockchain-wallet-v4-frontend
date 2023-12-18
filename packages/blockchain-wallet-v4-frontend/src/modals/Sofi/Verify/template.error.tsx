import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Text, TextGroup } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import { actions, selectors } from 'data'
import { ModalName } from 'data/types'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  height: 100%;
  flex: 1;
`

const Error = styled(TextGroup)`
  display: inline;
  margin-top: 3px;
`

const SofiMigrationPending = () => {
  const dispatch = useDispatch()
  return (
    <FlyoutContainer>
      <FlyoutContent mode='middle'>
        <Body>
          <Image name='close-error' height='60px' style={{ marginTop: '24px' }} />
          <Text
            size='20px'
            color='textBlack'
            weight={600}
            lineHeight='1.5'
            style={{ marginTop: '24px', textAlign: 'center' }}
          >
            <FormattedMessage
              id='scenes.sofi.signup.failure.generic.header'
              defaultMessage='Uh oh! Something went wrong.'
            />
          </Text>

          <Text
            size='16px'
            color='grey600'
            weight={500}
            lineHeight='1.5'
            style={{ marginTop: '24px', textAlign: 'center' }}
          >
            <FormattedMessage
              id='scenes.sofi.signup.failure.expired.body'
              defaultMessage='Restart your crypto account migration from your account on the SoFi website.'
            />
          </Text>
        </Body>
      </FlyoutContent>
      <FlyoutFooter>
        <Button
          nature='primary'
          fullwidth
          height='48px'
          data-e2e='viewDashboard'
          style={{ marginBottom: '16px', marginTop: '56px' }}
          onClick={() => dispatch(actions.modals.closeModal(ModalName.SOFI_VERIFY_ID))}
        >
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='buttons.ok' defaultMessage='OK' />
          </Text>
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

export default SofiMigrationPending
