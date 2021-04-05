import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { equals, prop } from 'ramda'
import styled from 'styled-components'

import {
  Banner,
  Button,
  HeartbeatLoader,
  Icon,
  Text
} from 'blockchain-info-components'

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  margin: 6px 0;
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
    background-color: ${props => !props.disabled && props.theme.blue000};
  }
`
const UninstallButton = styled(Button)`
  border-radius: 100px;
  height: 40px;
  width: 30px;
  max-width: 30px;
`
const StatusIcon = styled(Icon)`
  margin-right: 6px;
`
const RequiredBadge = styled(Banner)`
  width: 38px;
  height: 10px;
  padding: 4px;
  margin: -2px 0 0 5px;
  background: none;
  border: 1px solid #3558a8;
  border-radius: 6px;
  & > :first-child {
    font-size: 8px;
    color: #3558a8;
  }
`
const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`

class CoinActions extends React.PureComponent {
  render() {
    const { coinState, disableUpdates, installApp, uninstallApp } = this.props
    switch (prop('status', coinState)) {
      case 'Updating':
        return (
          <AppActions>
            <HeartbeatLoader
              style={{ marginRight: '8px' }}
              height='36px'
              width='36px'
            />
          </AppActions>
        )
      case 'Error':
        return (
          <AppActions>
            <Text size='11px' weight={500}>
              {coinState.error}
            </Text>
            <StatusIcon name='alert-filled' color='error' size='40px' />
          </AppActions>
        )
      case 'Success':
        return (
          <AppActions>
            <StatusIcon
              color='bch'
              name='checkmark-in-circle-filled'
              size='40px'
            />
          </AppActions>
        )
      default:
        return (
          <AppActions>
            <InstallButton
              nature='empty-secondary'
              width='80px'
              onClick={!disableUpdates ? installApp : undefined}
              disabled={disableUpdates}
            >
              <FormattedHTMLMessage
                id='components.lockbox.appmanager.install'
                defaultMessage='Install'
              />
            </InstallButton>
            <UninstallButton
              nature='empty'
              width='50px'
              onClick={!disableUpdates ? uninstallApp : undefined}
              disabled={disableUpdates}
            >
              <Icon name='trash' size='18px' />
            </UninstallButton>
          </AppActions>
        )
    }
  }
}

const LockboxAppManager = props => {
  const {
    app,
    coin,
    coinState,
    disableUpdates,
    installApp,
    requireBtc,
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
          <NameContainer>
            <Text size='14px' weight={500} color={'grey700'}>
              {name}
            </Text>
            {equals('btc', coinLower) && requireBtc && (
              <RequiredBadge
                label='true'
                type='informational'
                style={{ margin: '4px 0' }}
              >
                <FormattedHTMLMessage
                  id='components.lockbox.appmanager.required'
                  defaultMessage='Required'
                />
              </RequiredBadge>
            )}
          </NameContainer>
          <Text size='11px' weight={400}>
            {equals('Updating', prop('status', coinState)) ? (
              <FormattedHTMLMessage
                id='components.lockbox.appmanager.changeType'
                defaultMessage='{changeType}...'
                values={{ changeType: coinState.changeType }}
              />
            ) : (
              <FormattedHTMLMessage
                id='components.lockbox.appmanager.successmsg'
                defaultMessage='Version {version}'
                values={{ version }}
              />
            )}
          </Text>
        </div>
      </AppDetails>
      <CoinActions
        coinState={coinState}
        disableUpdates={disableUpdates}
        installApp={installApp}
        uninstallApp={uninstallApp}
      />
    </Row>
  )
}

export default LockboxAppManager
