import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import onClickOutside from 'react-onclickoutside'

import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { triangle, transparentize } from 'polished'
import { Icon, Link, Text } from 'blockchain-info-components'

import { Destination, MenuItem } from 'components/MenuLeft'
import media from 'services/ResponsiveService'

const SettingsDropdown = styled(Link)`
  display: flex;
  align-items: center;
  position: relative;
  .icon,
  .settings {
    transition: color 0.3s;
    color: ${props => transparentize(0.3, props.theme['white'])};
  }
  &:hover {
    .icon,
    .settings {
      color: ${props => props.theme['white']};
    }
  }
`
const SettingsIcon = styled(Icon)`
  margin-right: 8px;
`
const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 3;
  padding: 8px;
  border-radius: 4px;
  background: ${props => props.theme['white']};
  box-shadow: 0px 0px 16px rgba(18, 29, 51, 0.25);
`
const DropdownMenuItem = styled(MenuItem)`
  white-space: nowrap;
  padding: 8px 16px;
  margin-bottom: 0;
`
const DropdownMenuArrow = styled.div`
  position: absolute;
  top: -8px;
  right: 64px;
  ${props => {
    return triangle({
      pointingDirection: 'top',
      width: '16px',
      height: '8px',
      foregroundColor: props.theme['white']
    })
  }}
  ${media.tablet`
    right: 8px;
  `}
`
const SettingsText = styled(Text)`
  ${media.tablet`
    display: none;
  `}
`
const DropdownSeparator = styled.div`
  height: 1px;
  width: 24px;
  margin-left: 16px;
  margin-bottom: 8px;
  background: ${props => props.theme['gray-1']};
`

const Settings = props => {
  const { handleLogout } = props
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)

  Settings.handleClickOutside = () => toggleIsMenuOpen(false)

  return (
    <SettingsDropdown
      onClick={() => toggleIsMenuOpen(!isMenuOpen)}
      data-e2e='logoutLink'
    >
      <SettingsIcon
        className='icon'
        name='cog-filled'
        size='18px'
        color='white'
      />
      <SettingsText size='14px' weight={600} color='white' className='settings'>
        <FormattedMessage
          id='layouts.wallet.header.settings'
          defaultMessage='Settings'
        />
      </SettingsText>
      {isMenuOpen && (
        <DropdownMenu>
          <DropdownMenuArrow />
          <LinkContainer to='/settings/general' activeClassName='active'>
            <DropdownMenuItem>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.general'
                  defaultMessage='General'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/profile' activeClassName='active'>
            <DropdownMenuItem>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.profile'
                  defaultMessage='Profile'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/preferences' activeClassName='active'>
            <DropdownMenuItem>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.preferences'
                  defaultMessage='Preferences'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/addresses' activeClassName='active'>
            <DropdownMenuItem>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.walletsaddresses'
                  defaultMessage='Wallets & Addresses'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <LinkContainer to='/security-center' activeClassName='active'>
            <DropdownMenuItem>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.seccenter'
                  defaultMessage='Security Center'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <DropdownSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <Destination>
              <FormattedMessage
                id='layouts.wallet.header.Sign Out'
                defaultMessage='Sign Out'
              />
            </Destination>
          </DropdownMenuItem>
        </DropdownMenu>
      )}
    </SettingsDropdown>
  )
}

const clickOutsideConfig = {
  handleClickOutside: () => Settings.handleClickOutside
}

Settings.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default onClickOutside(Settings, clickOutsideConfig)
