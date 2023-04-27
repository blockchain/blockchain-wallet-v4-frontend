import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { NavLink } from 'react-router-dom'
import { IconWallet, PaletteColors } from '@blockchain-com/constellation'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import AppSwitcher from 'components/Navbar/AppSwitcher'
import { Logo, NavButton, NavContainer, NavLeft, NavRight } from 'components/Navbar/Navbar'
import UserNavDropdown from 'components/Navbar/UserNavDropdown'
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
  background-color: ${PaletteColors['white-900']};
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const NavCenter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin: 0 40px;
  ${media.tablet`
    margin: 0px;
    margin-right: 12px;
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

const NftsHeader: React.FC<Props> = ({
  ethAddress,
  isAuthenticated,
  isKycVerificationEnabled,
  modalActions,
  pathname,
  ...rest
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

  const trackEventCallback = useCallback(
    (eventName) => {
      rest.settingsActions.generalSettingsInternalRedirect(eventName)
    },
    [rest.settingsActions]
  )

  const logoutCallback = useCallback(() => {
    rest.sessionActions.logout()
  }, [rest.sessionActions])

  const limitsCallback = useCallback(() => {
    modalActions.showModal(ModalName.TRADING_LIMITS_MODAL, {
      origin: 'TradingLimits'
    })
    trackEventCallback('TradingLimits')
  }, [modalActions, trackEventCallback])

  const referAFriendCallback = useCallback(() => {
    modalActions.showModal(ModalName.REFERRAL_LANDING_MODAL, {
      origin: 'Header'
    })
    trackEventCallback('Referral')
  }, [modalActions, trackEventCallback])

  const taxCenterCallback = useCallback(() => {
    rest.history.push('/tax-center')

    rest.analyticsActions.trackEvent({
      key: Analytics.TAX_CENTER_CLICKED,
      properties: {
        origin: 'SETTINGS'
      }
    })
  }, [rest.analyticsActions, rest.history])

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
          <NavLinkButton to='/nfts/view' onClick={trackExploreClicked}>
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
              <IconWallet color={PaletteColors['purple-600']} label='wallet' size='small' />
              <span style={{ marginLeft: '4px' }}>
                <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
              </span>
            </Button>
            <NavButton data-e2e='settingsLink'>
              <LinkContainer to={`/nfts/address/${ethAddress}`}>
                <Link>
                  <UserNavDropdown
                    limitsClickHandler={limitsCallback}
                    trackEventCallback={trackEventCallback}
                    taxCenterClickHandler={taxCenterCallback}
                    isKycVerificationEnabled={isKycVerificationEnabled}
                    logoutClickHandler={logoutCallback}
                    referAFriendHandler={referAFriendCallback}
                  />
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

type Props = OwnProps & { history: { push: (path: string) => void } }

export default reduxForm<{}, Props>({ form: 'nftSearch' })(NftsHeader)
