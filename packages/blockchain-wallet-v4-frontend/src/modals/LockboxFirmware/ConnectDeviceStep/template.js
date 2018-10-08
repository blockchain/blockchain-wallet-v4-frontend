import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { RotateSync } from 'components/RotateSync'
import { Button, Text } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 24px;
`
const Content = styled.div`
  text-align: center;
  max-width: 400px;
  margin: 10px auto;
`
const ButtonContainer = styled.div`
  margin-top: 50px;
`
const RotateSyncContainer = styled(RotateSync)`
  margin-left: 15px;
`
const CheckForUpdatesStep = props => {
  const { isOnDashboard, onContinue } = props

  return (
    <React.Fragment>
      <Title>
        <Text size="22px" weight={400}>
          <FormattedMessage
            id="modals.lockboxfirmware.connectdevice.title"
            defaultMessage="Connect your Lockbox"
          />
        </Text>
      </Title>
      <Content>
        <Text size="15px" weight={300}>
          <FormattedMessage
            id="modals.lockboxfirmware.connectdevice.subtitle"
            defaultMessage="Connect and unlock your Lockbox. Then open the Dashboard app."
          />
        </Text>
      </Content>
      <ButtonContainer>
        <Button
          fullwidth
          disabled={!isOnDashboard}
          nature={isOnDashboard ? 'success' : 'dark'}
          onClick={onContinue}
        >
          {isOnDashboard ? (
            <FormattedMessage
              id="modals.lockboxfirmware.connectdevice.success"
              defaultMessage="Success! Click to Continue"
            />
          ) : (
            <FormattedMessage
              id="modals.lockboxfirmware.connectdevice.loading"
              defaultMessage="Open Dashboard App"
            />
          )}
          {!isOnDashboard && <RotateSyncContainer size="16px" color="white" />}
        </Button>
      </ButtonContainer>
    </React.Fragment>
  )
}

export default CheckForUpdatesStep
