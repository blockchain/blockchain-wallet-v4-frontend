import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { RotateSync } from 'components/RotateSync'
import { Button, Image, Link, Text, TextGroup } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`
const Content = styled(TextGroup)`
  text-align: center;
  margin-bottom: 20px;
  > * {
    margin-bottom: 0;
  }
`
const ButtonContainer = styled.div`
  margin-top: 20px;
`
const RotateSyncContainer = styled(RotateSync)`
  margin-left: 15px;
`
const InstallTexts = styled(TextGroup)`
  margin-top: 12px;
  & >:last-child {
    margin-left: -3px;
  }
`

const OpenBtcAppStep = props => {
  const { isReady, onInstallApps, onStepChange } = props

  return (
    <React.Fragment>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxsetup.openbtcappstep.title'
            defaultMessage='Lockbox + Blockchain Wallet'
          />
        </Text>
      </Title>
      <Content>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.openbtcappstep.explanation'
            defaultMessage='Now add a Bitcoin wallet to your device.'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.openbtcappstep.selection'
            defaultMessage='Select &quot;Bitcoin&quot; from the picker.'
          />
        </Text>
        <InstallTexts inline>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='modals.lockboxsetup.openbtcappstep.note'
              defaultMessage='Note:'
            />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.openbtcappstep.installapps'
              defaultMessage='If you do not have the Bitcoin app on your device, you can install it'
            />
          </Text>
          <Link size='14px' weight={400} onClick={onInstallApps}>
            <FormattedMessage
              id='modals.lockboxsetup.openbtcappstep.installappshere'
              defaultMessage='here.'
            />
          </Link>
        </InstallTexts>
      </Content>
      <Image
        name='lockbox-onboard-bitcoin'
        width='100%'
        srcset={{
          'lockbox-onboard-bitcoin2': '2x',
          'lockbox-onboard-bitcoin3': '3x'
        }}
      />
      <ButtonContainer>
        <Button
          fullwidth
          disabled={!isReady}
          nature={isReady ? 'success' : 'dark'}
          onClick={onStepChange}
        >
          {isReady ? (
            <FormattedMessage
              id='modals.lockboxsetup.openbtcappstep.success'
              defaultMessage='Success! Click to Continue'
            />
          ) : (
            <FormattedMessage
              id='modals.lockboxsetup.openbtcappstep.loading'
              defaultMessage='Open Your Bitcoin App'
            />
          )}
          {!isReady && <RotateSyncContainer size='16px' color='white' />}
        </Button>
      </ButtonContainer>
    </React.Fragment>
  )
}

export default OpenBtcAppStep
