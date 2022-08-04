import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon } from '@blockchain-com/constellation'
import {
  IconChevronRightV2,
  IconInformation,
  IconSettings,
  IconWallet
} from '@blockchain-com/icons'
import { removeAllConnections } from 'plugin/internal'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { Setting, SettingsHeading } from '..'

export const SettingsList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;
  align-items: stretch;
  gap: 32px;
  list-style: none;
`

export const SettingsLink = styled(Link)`
  text-decoration: none;
`

export const SettingsLinkLabel = styled(Text)`
  margin-left: 16px;
  flex-grow: 1;
`

const LogoutButton = styled.button`
  width: 100%;
  height: 48px;
  color: ${(props) => props.theme.grey400};
  border: 1px solid ${(props) => props.theme.grey400};
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
`

const Overal = (props) => {
  const dispatch = useDispatch()
  const { path } = props.match

  const overalSettings = [
    new Setting(
      'scenes.plugin.settings.connected_dapps.heading',
      'Connected Dapps',
      `${path}/connected-dapps`,
      <IconWallet />
    ),
    new Setting('layouts.wallet.header.general', 'General', `${path}/general`, <IconSettings />),
    new Setting('scenes.plugin.settings.info', 'About', `${path}/about`, <IconInformation />)
  ]
  const logout = async () => {
    await removeAllConnections()
    await chrome.storage.session.clear()
    window.close()
  }

  return (
    <>
      <SettingsHeading>
        <FormattedMessage id='scenes.lockbox.menu.settings' defaultMessage='Settings' />
      </SettingsHeading>
      <SettingsList>
        {overalSettings.map((setting: Setting) => (
          <li key={setting.label}>
            <SettingsLink to={setting.path}>
              <Flex justifyContent='space-between' alignItems='center'>
                <Icon color='grey700' label='IconBack' size='md'>
                  {setting.icon}
                </Icon>
                <SettingsLinkLabel>
                  <FormattedMessage id={setting.id} defaultMessage={setting.label} />
                </SettingsLinkLabel>
                <Icon color='grey700' label='IconBack' size='md'>
                  <IconChevronRightV2 />
                </Icon>
              </Flex>
            </SettingsLink>
          </li>
        ))}
      </SettingsList>
      <LogoutButton onClick={logout}>
        <FormattedMessage id='layouts.wallet.header.Sign Out' defaultMessage='Sign Out' />
      </LogoutButton>
    </>
  )
}

export default Overal
