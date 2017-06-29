import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CircleButton } from 'components/Shared/Button'
import Wrapper from './Wrapper'
import NavbarContainer from './NavbarContainer'
import NavbarLogo from './NavbarLogo'
import NavbarMenu from './NavbarMenu'
import NavbarMenuItem from './NavbarMenuItem'
import NavbarLink from './NavbarLink'
import NavbarLinkContainer from './NavbarLinkContainer'
import NavbarLinkRouter from './NavbarLinkRouter'
import NavbarButtonContainer from './NavbarButtonContainer'

const Header = (props) => {
  return (
    <Wrapper>
      <NavbarContainer>
        <NavbarLinkContainer>
          <NavbarLinkRouter to='/'>
            <NavbarLogo />
          </NavbarLinkRouter>
          <NavbarMenu>
            <NavbarLinkRouter to='/wallet'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.wallets' defaultMessage='Wallets' />
              </NavbarMenuItem>
            </NavbarLinkRouter>
            <NavbarLink href='https://blockchain.info/charts'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.charts' defaultMessage='Charts' />
              </NavbarMenuItem>
            </NavbarLink>
            <NavbarLink href='https://blockchain.info/stats'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.stats' defaultMessage='Stats' />
              </NavbarMenuItem>
            </NavbarLink>
            <NavbarLink href='https://blockchain.info/markets'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.markets' defaultMessage='Markets' />
              </NavbarMenuItem>
            </NavbarLink>
            <NavbarLink href='https://blockchain.info/api'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.api' defaultMessage='Api' />
              </NavbarMenuItem>
            </NavbarLink>
          </NavbarMenu>
        </NavbarLinkContainer>
        <NavbarButtonContainer>
          <CircleButton type='primary'>
            <NavbarLinkRouter to='/login'>
              <FormattedMessage id='components.layouts.landing.header.login' defaultMessage='Log in' />
            </NavbarLinkRouter>
          </CircleButton>
          <CircleButton type='secondary'>
            <NavbarLinkRouter to='/register'>
              <FormattedMessage id='components.layouts.landing.header.signup' defaultMessage='Sign up' />
            </NavbarLinkRouter>
          </CircleButton>
        </NavbarButtonContainer>
      </NavbarContainer>
    </Wrapper>
  )
}

export default Header
