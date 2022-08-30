import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { NavLink } from 'react-router-dom'
import { IconUser, IconWallet, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Image, SpinningLoader, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import AppSwitcher from 'components/Navbar/AppSwitcher'
import { Logo, NavButton, NavContainer, NavLeft, NavRight } from 'components/Navbar/Navbar'
import { selectors } from 'data'
import { useMedia } from 'services/styles'

import { Props as OwnProps } from '../Dex'

export const FIXED_HEADER_HEIGHT = 56

const StickyNav = styled(NavContainer)`
  top: 0;
  z-index: 3;
  position: fixed;
  background-color: ${PaletteColors['white-900']};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const DexHeader: React.FC<Props> = ({ ethBalanceR, isAuthenticated, pathname }) => {
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
            <Button small data-e2e='back' nature='empty'>
              {ethBalanceR.cata({
                Failure: () => <>N/A</>,
                Loading: () => <SpinningLoader width='10px' height='10px' borderWidth='3px' />,
                NotAsked: () => <SpinningLoader width='10px' height='10px' borderWidth='3px' />,
                Success: (ethBalance) => (
                  <>
                    <IconWallet color={PaletteColors['grey-400']} size='small' />
                    <Text
                      color='grey900'
                      lineHeight='20px'
                      size='14px'
                      weight={600}
                      style={{ marginLeft: '10px' }}
                    >
                      Wallet
                    </Text>
                  </>
                )
              })}
            </Button>
            <NavButton data-e2e='settingsLink'>
              <IconUser color={PaletteColors['grey-400']} size='small' />
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

const mapStateToProps = (state) => ({
  ethBalanceR: selectors.balances.getCoinNonCustodialBalance('ETH')(state)
})

const connector = connect(mapStateToProps)
type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(DexHeader)
