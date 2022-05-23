import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { NavLink } from 'react-router-dom'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconUser, IconWallet } from '@blockchain-com/icons'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import AppSwitcher from 'components/NavbarV2/AppSwitcher'
import { Logo, NavButton, NavContainer, NavLeft, NavRight } from 'components/NavbarV2/Navbar'
import { actions } from 'data'
import { Analytics, ModalName } from 'data/types'
import { media, useMedia } from 'services/styles'

import { Props as OwnProps } from '../Nfts'
import NftsSearch from './NftsSearch'

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
const NavCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 40px;
  ${media.tablet`
    width: auto;
  `}
`
const NavLinkButton = styled(NavLink)`
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  margin-right: 12px;
  transition: color 0.3s, background-color 0.3s;
  &:hover,
  &.active {
    background-color: ${(props) => props.theme.purple000};
    * {
      color: ${(props) => props.theme.purple600};
    }
  }
`

const ExploreHeader: React.FC<Props> = ({
  ethAddress,
  isAuthenticated,
  modalActions,
  pathname
}) => {
  const dispatch = useDispatch()
  const trackExploreClicked = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_EXPLORER_CLICKED,
        properties: {}
      })
    )
  }
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
      <NavCenter>
        {isTablet ? null : (
          <NavLinkButton to='/nfts/home' onClick={trackExploreClicked}>
            <Text size='14px' weight={600}>
              <FormattedMessage id='copy.home' defaultMessage='Home' />
            </Text>
          </NavLinkButton>
        )}
        {isTablet ? null : (
          <NavLinkButton to='/nfts/explore' onClick={trackExploreClicked}>
            <Text size='14px' weight={600}>
              <FormattedMessage id='copy.explore' defaultMessage='Explore' />
            </Text>
          </NavLinkButton>
        )}
        <NftsSearch />
      </NavCenter>
      <NavRight>
        {isAuthenticated ? (
          <Flex gap={8} alignItems='center'>
            <Button
              small
              data-e2e='back'
              nature='empty-purple'
              onClick={() =>
                modalActions.showModal(ModalName.ETH_WALLET_BALANCES, { origin: 'Unknown' })
              }
            >
              <Icon label='wallet' size='sm' color='purple600'>
                <IconWallet />
              </Icon>
              <span style={{ marginLeft: '4px' }}>
                <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
              </span>
            </Button>
            <NavButton data-e2e='settingsLink'>
              <LinkContainer to={`/nfts/address/${ethAddress}`}>
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
              <Button small data-e2e='login' nature='empty-purple'>
                <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
              </Button>
            </LinkContainer>
            {isTablet ? null : (
              <LinkContainer to={`/open${pathname}`} data-e2e='signupLink'>
                <Button small data-e2e='signup' nature='purple'>
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

export default reduxForm<{}, Props>({ form: 'nftSearch' })(ExploreHeader)
