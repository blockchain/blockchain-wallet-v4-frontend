import React from 'react'
import styled from 'styled-components'
import { FormattedHTMLMessage } from 'react-intl'

import { Button, Icon, Text, TextGroup } from 'blockchain-info-components'
// import { RotateSync } from 'components/RotateSync'

const Row = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin: 10px 0;
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
const CoinIcon = styled(Icon)`
  background-color: ${props => props.theme[props.coin]};
`
const CoinInstallStatus = props => {
  const { app, coin, installApp, uninstallApp } = props
  const { name, version } = app

  return (
    <Row>
      <AppDetails>
        <CoinIcon name={`${coin.toLowerCase()}-circle`} size='40px' />
        <div>
          <Text size='15px' weight={400}>
            {name}
          </Text>
          <Text size='13px' weight={300}>
            v{version}
          </Text>
        </div>
      </AppDetails>
      <AppActions>
        <Button nature='empty' width='75px' onClick={installApp}>
          <FormattedHTMLMessage
            id='modals.lockbox.appmanager.install'
            defaultMessage='Install'
          />
        </Button>
        <Button nature='empty' width='75px' onClick={uninstallApp}>
          <Icon name='trash' size='18px' />
        </Button>
      </AppActions>
    </Row>
  )
}

export default CoinInstallStatus
