import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon } from '@blockchain-com/constellation'
import {
  IconChevronRightV2,
  IconInformation,
  IconSettings,
  IconWallet
} from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions } from 'data'

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
  color: #98a1b2;
  border: 1px solid #98a1b2aa;
  background: transparent;
  border-radius: 10px;
`

const Overal = (props) => {
  const { path } = props.match

  const overalSettings = [
    new Setting('Network', `${path}/networks`, <IconWallet />),
    new Setting('Connected Dapps', `${path}/connected-dapps`, <IconWallet />),
    new Setting('General', `${path}/general`, <IconSettings />),
    new Setting('Info', `${path}/info`, <IconInformation />)
  ]
  const logout = () => {
    props.sessionActions.deauthorizeBrowser()
  }

  return (
    <>
      <SettingsHeading>Settings</SettingsHeading>
      <SettingsList>
        {overalSettings.map((setting: Setting) => (
          <li key={setting.label}>
            <SettingsLink to={setting.path}>
              <Flex justifyContent='space-between' alignItems='center'>
                <Icon color='white800' label='IconBack' size='md'>
                  {setting.icon}
                </Icon>
                <SettingsLinkLabel>{setting.label}</SettingsLinkLabel>
                <Icon color='white800' label='IconBack' size='md'>
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

const mapDispatchToProps = (dispatch) => ({
  routerActions: bindActionCreators(actions.router, dispatch),
  sessionActions: bindActionCreators(actions.session, dispatch)
})

export default connect(null, mapDispatchToProps)(Overal)
