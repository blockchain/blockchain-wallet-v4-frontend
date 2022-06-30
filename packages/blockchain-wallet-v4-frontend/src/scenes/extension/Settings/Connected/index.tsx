import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Disconnect } from 'blockchain-wallet-v4-frontend/src/icons/Disconnect'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { SettingsHeading } from '..'
import { SettingsList } from '../Overal'

const Dapp = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`

const DisconnectButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: #0c6cf2;
  color: black;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`

export const Connected = () => {
  return (
    <>
      <SettingsHeading>
        <FormattedMessage
          id='scenes.plugin.settings.conected_dapps.heading'
          defaultMessage='Connected Dapps'
        />
      </SettingsHeading>
      <SettingsList>
        <Dapp>
          <Text>test.org</Text>
          <Disconnect />
        </Dapp>
        <Dapp>
          <Text>test2.org</Text>
          <Disconnect />
        </Dapp>
      </SettingsList>
      <DisconnectButton>
        <FormattedMessage
          id='scenes.plugin.settings.conected_dapps.disconnect_all'
          defaultMessage='Disconnect all'
        />
      </DisconnectButton>
    </>
  )
}
