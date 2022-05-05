import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { NavLink } from 'react-router-dom'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconUser, IconWallet } from '@blockchain-com/icons'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import AppSwitcher from 'components/NavbarV2/AppSwitcher'
import { Logo, NavContainer, NavLeft, NavRight } from 'components/NavbarV2/Navbar'
import { ModalName } from 'data/types'

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
  width: 50%;
`
const NavLinkButton = styled(Link)`
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  margin-right: 12px;
  background-color: ${(props) => props.theme.blue000};
  * {
    color: ${(props) => props.theme.blue600};
  }
`

const ExploreHeader: React.FC<Props> = ({
  ethAddress,
  isAuthenticated,
  modalActions,
  pathname,
  routerActions
}) => {
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
        <LinkContainer to='/nfts/explore'>
          <NavLinkButton>
            <Flex alignItems='center' gap={4}>
              <Text size='14px' weight={600}>
                <FormattedMessage id='copy.explore' defaultMessage='Explore' />
              </Text>
              🚀
            </Flex>
          </NavLinkButton>
        </LinkContainer>
        <NftsSearch />
      </NavCenter>
      <NavRight>
        {isAuthenticated ? (
          <Flex gap={8} alignItems='center'>
            <Button
              small
              data-e2e='back'
              nature='empty-blue'
              onClick={() =>
                modalActions.showModal(ModalName.ETH_WALLET_BALANCES, { origin: 'Unknown' })
              }
            >
              <Icon label='arrow-left' size='sm' color='blue600'>
                <IconWallet />
              </Icon>
              <span style={{ marginLeft: '4px' }}>
                <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
              </span>
            </Button>
            <Icon color='grey400' label='user-page' size='sm'>
              <IconUser
                cursor='pointer'
                onClick={() => routerActions.push(`/nfts/address/${ethAddress}`)}
                style={{ marginLeft: '4px' }}
              />
            </Icon>
          </Flex>
        ) : (
          <>
            <LinkContainer
              style={{ marginRight: '8px' }}
              to={`/open${pathname}`}
              data-e2e='loginLink'
            >
              <Button small data-e2e='login' nature='empty-blue'>
                <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
              </Button>
            </LinkContainer>
            <LinkContainer to={`/open${pathname}`} data-e2e='signupLink'>
              <Button small data-e2e='signup' nature='primary'>
                <FormattedMessage id='buttons.signup' defaultMessage='Sign Up' />
              </Button>
            </LinkContainer>
          </>
        )}
      </NavRight>
    </StickyNav>
  )
}

type Props = OwnProps

export default reduxForm<{}, Props>({ form: 'nftSearch' })(ExploreHeader)
