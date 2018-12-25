import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon } from 'blockchain-info-components'
import { Wrapper, MenuItem, SubMenu, SubMenuItem } from 'components/MenuLeft'

const Footer = props => {
  const { settingsOpened } = props.data

  return (
    <Wrapper>
      <LinkContainer to='/security-center' activeClassName='active'>
        <MenuItem data-e2e='securityCenterLink'>
          <Icon name='security' />
          <FormattedMessage
            id='layouts.wallet.menuleft.footer.securitycenter'
            defaultMessage='Security Center'
          />
        </MenuItem>
      </LinkContainer>
      <LinkContainer
        to='/settings/general'
        activeClassName='active'
        className={settingsOpened ? 'active' : ''}
      >
        <MenuItem data-e2e='settingsLink'>
          <Icon name='settings' />
          <FormattedMessage
            id='layouts.wallet.menuleft.footer.settings'
            defaultMessage='Settings'
          />
        </MenuItem>
      </LinkContainer>
      {settingsOpened && (
        <SubMenu>
          <LinkContainer to='/settings/general' activeClassName='active'>
            <SubMenuItem data-e2e='settings_generalLink'>
              <FormattedMessage
                id='layouts.wallet.menuleft.footer.general'
                defaultMessage='General'
              />
            </SubMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/profile' activeClassName='active'>
            <SubMenuItem data-e2e='settings_profileLink'>
              <FormattedMessage
                id='layouts.wallet.menuleft.footer.profile'
                defaultMessage='Profile'
              />
            </SubMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/preferences' activeClassName='active'>
            <SubMenuItem data-e2e='settings_preferencesLink'>
              <FormattedMessage
                id='layouts.wallet.menuleft.footer.preferences'
                defaultMessage='Preferences'
              />
            </SubMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/addresses' activeClassName='active'>
            <SubMenuItem data-e2e='settings_walletsLink'>
              <FormattedMessage
                id='layouts.wallet.menuleft.footer.addresses'
                defaultMessage='Wallets & Addresses'
              />
            </SubMenuItem>
          </LinkContainer>
        </SubMenu>
      )}
    </Wrapper>
  )
}

export default Footer
