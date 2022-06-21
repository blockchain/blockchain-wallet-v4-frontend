import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@blockchain-com/constellation'
import {
  IconChevronRightV2,
  IconInformation,
  IconSettings,
  IconWallet
} from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
`

export const SettingsLinkLabel = styled(Text)`
  margin-left: 16px;
  flex-grow: 1;
`

const LogoutButton = styled.button`
  width: 100%;
  height: 48px;
  color: #98a1b2;
  border: 1px solid #98a1b2aa;
  background: transparent;
  border-radius: 10px;
`

export const Overal = (props) => {
  const { path } = props.match

  const overalSettings = [
    new Setting('Account', `${path}/account`, <IconWallet />),
    new Setting('Network', `${path}/networks`, <IconWallet />),
    new Setting('Connected Dapps', `${path}/dapps`, <IconWallet />),
    new Setting('General', `${path}/general`, <IconSettings />),
    new Setting('Info', `${path}/info`, <IconInformation />)
  ]

  return (
    <>
      <SettingsHeading>Settings</SettingsHeading>
      <SettingsList>
        {overalSettings.map((setting: Setting) => (
          <li key={setting.label}>
            <SettingsLink to={setting.path}>
              <Icon color='white800' label='IconBack' size='md'>
                {setting.icon}
              </Icon>
              <SettingsLinkLabel>{setting.label}</SettingsLinkLabel>
              <Icon color='white800' label='IconBack' size='md'>
                <IconChevronRightV2 />
              </Icon>
            </SettingsLink>
          </li>
        ))}
      </SettingsList>
      <LogoutButton>Sign out</LogoutButton>
    </>
  )
}
