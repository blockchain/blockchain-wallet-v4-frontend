import React from 'react'
import styled from 'styled-components'
import { FormattedHTMLMessage } from 'react-intl'

import { Button, Icon, Text } from 'blockchain-info-components'

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

const CoinName = styled(Text)`
  font-size: 16px;
  font-weight: 500;
`
const CoinIcon = styled(Icon)`
  font-size: 40px;
  margin-right: 4px;
`
const CoinInstallStatus = props => {
  const { app, coin, installApp, uninstallApp } = props
  const { name, version } = app
  const coinLower = coin.toLowerCase()

  return (
    <Row>
      <AppDetails>
        <CoinIcon color={coinLower} name={`${coinLower}-circle-filled`} />
        <div>
          <CoinName color={'gray-5'}>{name}</CoinName>
          <Text size='13px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.successmsg'
              defaultMessage='Version {version}'
              values={{ version }}
            />
          </Text>
        </div>
      </AppDetails>
      <AppActions>
        <Button nature='empty-secondary' width='80px' onClick={installApp}>
          <FormattedHTMLMessage
            id='modals.lockbox.appmanager.install'
            defaultMessage='Install'
          />
        </Button>
        <Button nature='empty' width='50px' onClick={uninstallApp}>
          <Icon name='trash' size='18px' />
        </Button>
      </AppActions>
    </Row>
  )
}

export default CoinInstallStatus
