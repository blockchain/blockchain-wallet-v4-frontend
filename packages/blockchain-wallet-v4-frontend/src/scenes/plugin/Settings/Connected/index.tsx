import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconCloseV2 } from '@blockchain-com/icons'
import { getConnectionsList, removeAllConnections, removeConnection } from 'plugin/internal'
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
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`

const DisconnectAllButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${(props) => props.theme.white};
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

const DomainAddress = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  width: 312px;
`

export const Connected = () => {
  const [connectedDomains, setConnectedDomains] = useState<string[]>([])

  const disconnect = async (domain: string) => {
    await removeConnection(domain)
    const connectedDomains: string[] = await getConnectionsList()
    setConnectedDomains(connectedDomains)
  }

  const disconnectAll = async () => {
    await removeAllConnections()
    setConnectedDomains([])
  }

  useEffect(() => {
    ;(async () => {
      const connectedDomains: string[] = await getConnectionsList()
      setConnectedDomains(connectedDomains)
    })()
  }, [])

  return (
    <>
      <SettingsHeading>
        <FormattedMessage
          id='scenes.plugin.settings.conected_dapps.heading'
          defaultMessage='Connected Dapps'
        />
      </SettingsHeading>
      <SettingsList>
        {connectedDomains.map((domain: string) => (
          <Dapp key={domain}>
            <DomainAddress>{domain}</DomainAddress>
            <DisconnectButton onClick={() => disconnect(domain)}>
              <Icon color='grey700' label='IconClose' size='md'>
                <IconCloseV2 />
              </Icon>
            </DisconnectButton>
          </Dapp>
        ))}
      </SettingsList>
      <DisconnectAllButton onClick={disconnectAll}>
        <FormattedMessage
          id='scenes.plugin.settings.conected_dapps.disconnect_all'
          defaultMessage='Disconnect all'
        />
      </DisconnectAllButton>
    </>
  )
}
