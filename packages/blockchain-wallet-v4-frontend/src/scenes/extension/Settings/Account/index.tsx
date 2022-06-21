import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronRightV2 } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Setting, SettingsHeading } from '..'
import { SettingsLink, SettingsLinkLabel, SettingsList } from '../Overal'

const AccountSettingLabel = styled(SettingsLinkLabel)`
  margin-left: 0;
`

export const Account = (props) => {
  const { path } = props.match

  const accountSettings = [
    new Setting('Import account', `${path}/import`),
    new Setting('Upgrade account', `${path}/upgrade`)
  ]
  return (
    <>
      <SettingsHeading>Account</SettingsHeading>
      <SettingsList>
        {accountSettings.map((setting: Setting) => (
          <li key={setting.label}>
            <SettingsLink to={setting.path}>
              <AccountSettingLabel>{setting.label}</AccountSettingLabel>
              <Icon color='white800' label='IconBack' size='md'>
                <IconChevronRightV2 />
              </Icon>
            </SettingsLink>
          </li>
        ))}
      </SettingsList>
    </>
  )
}
