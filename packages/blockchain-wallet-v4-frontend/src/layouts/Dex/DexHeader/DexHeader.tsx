import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { NavLink } from 'react-router-dom'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconUser, IconWallet } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Button, Image, Link } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import AppSwitcher from 'components/Navbar/AppSwitcher'
import { Logo, NavButton, NavContainer, NavLeft, NavRight } from 'components/Navbar/Navbar'
import { useMedia } from 'services/styles'

import { Props as OwnProps } from '../Dex'

export const FIXED_HEADER_HEIGHT = 56

const StickyNav = styled(NavContainer)`
  top: 0;
  z-index: 3;
  position: fixed;
  background-color: ${colors.white900};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const DexHeader: React.FC<Props> = ({ isAuthenticated, pathname }) => {
  const isTablet = useMedia('tablet')

  return (
    <StickyNav>
      <NavLeft>
        <Logo>
          <NavLink to='/home' data-e2e='homeLink'>
            <Image width='25px' name='blockchain-icon' />
          </NavLink>
        </Logo>
        <AppSwitcher />
      </NavLeft>
      <NavRight>
        {isAuthenticated ? (
          <Flex gap={8} alignItems='center'>
            <Button small data-e2e='back' nature='empty-purple'>
              <Icon label='wallet' size='sm' color='purple600'>
                <IconWallet />
              </Icon>
              <span style={{ marginLeft: '4px' }}>
                <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
              </span>
            </Button>
            <NavButton data-e2e='settingsLink'>
              <LinkContainer to='/nfts/address'>
                <Link>
                  <Icon color='grey400' label='open-menu' size='sm'>
                    <IconUser />
                  </Icon>
                </Link>
              </LinkContainer>
            </NavButton>
          </Flex>
        ) : (
          <>
            <LinkContainer
              style={isTablet ? {} : { marginRight: '8px' }}
              to={`/open${pathname}`}
              data-e2e='loginLink'
            >
              <Button small data-e2e='login' nature='empty-blue'>
                <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
              </Button>
            </LinkContainer>
            {isTablet ? null : (
              <LinkContainer to={`/open${pathname}`} data-e2e='signupLink'>
                <Button small data-e2e='signup' nature='primary'>
                  <FormattedMessage id='buttons.signup' defaultMessage='Sign Up' />
                </Button>
              </LinkContainer>
            )}
          </>
        )}
      </NavRight>
    </StickyNav>
  )
}

type Props = OwnProps

export default DexHeader
