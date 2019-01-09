import React from 'react'
import styled from 'styled-components'
import { FormattedHTMLMessage } from 'react-intl'

import { Button, Icon, HeartbeatLoader, Text } from 'blockchain-info-components'

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin: 5px 0;
`
const AppDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  justify-items: center;
  & > :last-child {
    margin-left: 15px;
  }
`
const AppActions = styled.div`
  width: 100%;
  display: flex;
  flex-grow: 2;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  & > :last-child {
    margin-left: 10px;
  }
`
const IconBox = styled.div`
  padding: 5px;
  border-radius: 3px;
  background-color: ${props => props.theme[props.coin]};
`
const InstallButton = styled(Button)`
  border-radius: 20px;
  height: 40px;
  width: 40px;
  &:hover {
    background-color: ${props =>
      !props.disabled && props.theme['brand-quaternary']};
  }
`
const UninstallButton = styled(Button)`
  border-radius: 100px;
  height: 40px;
  width: 30px;
  max-width: 30px;
`
const StatusText = styled(Text)`
  margin-right: 8px;
`
const LockboxAppManager = props => {
  const {
    app,
    coin,
    coinState,
    disableUpdates,
    installApp,
    uninstallApp
  } = props
  const { name, version } = app
  const coinLower = coin.toLowerCase()

  return (
    <Row>
      <AppDetails>
        <IconBox coin={coinLower}>
          <Icon size='34px' color='white' name={`${coinLower}`} />
        </IconBox>
        <div>
          <Text size='13px' weight={400} color={'gray-5'}>
            {name}
          </Text>
          <Text size='11px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.successmsg'
              defaultMessage='Version {version}'
              values={{ version }}
            />
          </Text>
        </div>
      </AppDetails>
      {(function () {
        switch (coinState && coinState.status) {
          case 'Updating':
            return (
              <AppActions>
                <HeartbeatLoader
                  style={{ marginRight: '8px' }}
                  height='34px'
                  width='34px'
                />
              </AppActions>
            )
          case 'Error':
            return (
              <AppActions>
                <Icon name='alert-filled' color='error' size='34px' />
                <StatusText weight={400} size='18px'>
                  <FormattedHTMLMessage
                    id='modals.lockbox.appmanager.error'
                    defaultMessage='Error'
                  />
                </StatusText>
              </AppActions>
            )
          case 'Success':
            return (
              <AppActions>
                <Icon
                  name='checkmark-in-circle-filled'
                  color='success'
                  size='34px'
                />
                <StatusText weight={400} size='18px'>
                  <FormattedHTMLMessage
                    id='modals.lockbox.appmanager.success'
                    defaultMessage='Success'
                  />
                </StatusText>
              </AppActions>
            )
          default:
            return (
              <AppActions>
                <InstallButton
                  nature='empty-secondary'
                  width='80px'
                  onClick={!disableUpdates && installApp}
                  disabled={disableUpdates}
                >
                  <FormattedHTMLMessage
                    id='modals.lockbox.appmanager.install'
                    defaultMessage='Install'
                  />
                </InstallButton>
                <UninstallButton
                  nature='empty'
                  width='50px'
                  onClick={!disableUpdates && uninstallApp}
                  disabled={disableUpdates}
                >
                  <Icon name='trash' size='18px' />
                </UninstallButton>
              </AppActions>
            )
        }
      })()}
    </Row>
  )
}

export default LockboxAppManager
