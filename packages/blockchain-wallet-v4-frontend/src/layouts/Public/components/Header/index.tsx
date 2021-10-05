import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image, Link, Text } from 'blockchain-info-components'
import Announcements from 'components/Announcements'
import { Navbar, NavbarBrand } from 'components/Navbar'
import { ProductAuthOptions } from 'data/types'
import Wallet from 'layouts/Wallet'
import { media } from 'services/styles'

const NavbarStyled = styled(Navbar)`
  padding: 0 16px;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.grey900};
  background-image: url('/img/bg-pattern.svg');
`
const NavbarBrandStyled = styled(NavbarBrand)`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  padding-left: 0;
`

const BlockchainLogoImage = styled(Image)`
  width: 240px;
  display: block;
  ${media.tablet`
    width: 200px;
  `}
`
const PublicBrand = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ExhangeHeader = styled(Text)`
  color: ${(props) => props.theme.blue400};
  font-size: 24px;
  font-weight: 600;
`

const WalletHeader = styled(Text)`
  color: ${(props) => props.theme.purple400};
  font-size: 24px;
  font-weight: 600;
`

const HeaderLink = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const Header = ({ designatedProduct }) => {
  return (
    <>
      <NavbarStyled height='112px'>
        <NavbarBrandStyled>
          <PublicBrand>
            <HeaderLink href='https://www.blockchain.com'>
              <BlockchainLogoImage name='blockchain-logo' height='24px' />
              {designatedProduct === ProductAuthOptions.EXCHANGE && (
                <ExhangeHeader>
                  <FormattedMessage id='copy.exchange' defaultMessage='Exchange' />
                </ExhangeHeader>
              )}
              {designatedProduct === ProductAuthOptions.WALLET && (
                <WalletHeader>
                  <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
                </WalletHeader>
              )}
            </HeaderLink>
          </PublicBrand>
        </NavbarBrandStyled>
      </NavbarStyled>
      <Announcements type='service' alertArea='public' />
    </>
  )
}

export default Header
