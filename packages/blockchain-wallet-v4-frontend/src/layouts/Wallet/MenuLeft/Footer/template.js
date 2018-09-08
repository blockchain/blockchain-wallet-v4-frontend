import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon } from 'blockchain-info-components'
import SecurityGauge from './SecurityGauge'
import { Wrapper, MenuItem, SubMenu, SubMenuItem } from 'components/MenuLeft'

const Footer = props => {
  const { settingsOpened, userFlowSupported } = props.data

  return (
    <Wrapper>
      <LinkContainer to='/security-center' activeClassName='active'>
        <MenuItem>
          <Icon name='security' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.securitycenter'
            defaultMessage='Security Center'
          />
          <SecurityGauge />
        </MenuItem>
      </LinkContainer>
      <LinkContainer
        to='/settings/info'
        activeClassName='active'
        className={settingsOpened ? 'active' : ''}
      >
        <MenuItem>
          <Icon name='settings' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.settings'
            defaultMessage='Settings'
          />
        </MenuItem>
      </LinkContainer>
      {settingsOpened && (
        <SubMenu>
          <LinkContainer to='/settings/info' activeClassName='active'>
            <SubMenuItem>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.general'
                defaultMessage='General'
              />
            </SubMenuItem>
          </LinkContainer>
          {userFlowSupported && (
            <LinkContainer to='/settings/profile' activeClassName='active'>
              <SubMenuItem>
                <FormattedMessage
                  id='layouts.wallet.menuleft.navigation.profile'
                  defaultMessage='Profile'
                />
              </SubMenuItem>
            </LinkContainer>
          )}
          <LinkContainer to='/settings/preferences' activeClassName='active'>
            <SubMenuItem>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.preferences'
                defaultMessage='Preferences'
              />
            </SubMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/addresses' activeClassName='active'>
            <SubMenuItem>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.addresses'
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
