import React from 'react'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`
const TitleBar = styled.div`
  width: 100%;
  padding: 10px 0;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const TitleBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 30px;
`
const CurrencyList = styled.div`
  display: flex;
  width: 100%;
  padding: 16px 0;
  justify-content: space-around;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const SettingsIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`

const Menu = props => {
  const { deviceName } = props
  const openSettings = () => {
    window.alert('settings')
  }

  return (
    <Container>
      <TitleBar>
        <TitleBarWrapper>
          <Text size='24px' weight={400}>
            {deviceName}
          </Text>
          <SettingsIcon
            name='settings-filled'
            size={'24px'}
            onClick={openSettings}
          />
        </TitleBarWrapper>
      </TitleBar>
      <CurrencyList>
        <Button>BTC</Button>
        <Button>BCH</Button>
        <Button>ETH</Button>
      </CurrencyList>
    </Container>
  )
}

export default Menu
