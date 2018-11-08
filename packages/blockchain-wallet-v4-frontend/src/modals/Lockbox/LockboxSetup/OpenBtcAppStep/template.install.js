import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Button, Icon, Link, Text, TextGroup } from 'blockchain-info-components'

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
const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 12px;
`
const ButtonContainer = styled.div`
  margin-top: 20px;
`
const InstallTexts = styled(TextGroup)`
  margin-top: 12px;
  & > :last-child {
    margin-left: -3px;
  }
`

// TODO: clean up in LB2
const InstallBtcAppStep = props => {
  const { onInstallBtc, onSkipInstall } = props

  return (
    <React.Fragment>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxsetup.installbtcappstep.title'
            defaultMessage='Lockbox + Blockchain Wallet'
          />
        </Text>
      </Title>
      <Content>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.installbtcappstep.explanation'
            defaultMessage="Now let's install the Bitcoin app to your device."
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.installbtcappstep.selection'
            defaultMessage='Click &quot;Continue&quot; to start the install process.'
          />
        </Text>
        <IconContainer>
          <Icon color={'btc'} name={`btc-circle-filled`} size='75px' />
        </IconContainer>
        <InstallTexts inline>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='modals.lockboxsetup.installbtcappstep.note'
              defaultMessage='Note:'
            />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.installbtcappstep.skipinstall'
              defaultMessage='If this device has already been setup and it has the Bitcoin app installed, click'
            />
          </Text>
          <Link size='14px' weight={400} onClick={onSkipInstall}>
            <FormattedMessage
              id='modals.lockboxsetup.installbtcappstep.skipinstallhere'
              defaultMessage='here.'
            />
          </Link>
        </InstallTexts>
      </Content>
      <ButtonContainer>
        <Button fullwidth nature='success' onClick={onInstallBtc}>
          <FormattedMessage
            id='modals.lockboxsetup.installbtcappstep.continue'
            defaultMessage='Continue'
          />
        </Button>
      </ButtonContainer>
    </React.Fragment>
  )
}

export default InstallBtcAppStep
