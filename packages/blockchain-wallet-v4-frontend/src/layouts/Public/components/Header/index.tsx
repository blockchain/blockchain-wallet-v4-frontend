import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image, Link, Text } from 'blockchain-info-components'
import Announcements from 'components/Announcements'
import { Navbar, NavbarBrand } from 'components/Navbar'
import { LoginSteps, ProductAuthMetadata, ProductAuthOptions } from 'data/types'
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
const ExchangeHeader = styled(Text)`
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

const Header = ({ loginStep, productAuthMetadata }: Props) => {
  const showExchangeHeader =
    (loginStep === LoginSteps.ENTER_PASSWORD_EXCHANGE ||
      productAuthMetadata?.product === ProductAuthOptions.EXCHANGE) &&
    loginStep !== LoginSteps.ENTER_PASSWORD_WALLET
  const showWalletHeader =
    (loginStep === LoginSteps.ENTER_PASSWORD_WALLET ||
      productAuthMetadata?.product === ProductAuthOptions.WALLET) &&
    loginStep !== LoginSteps.ENTER_PASSWORD_EXCHANGE

  return (
    <>
      <NavbarStyled height='112px'>
        <NavbarBrandStyled>
          <PublicBrand>
            <HeaderLink href='https://www.blockchain.com'>
              <BlockchainLogoImage name='blockchain-logo' height='24px' />
              {showExchangeHeader && (
                <ExchangeHeader>
                  <FormattedMessage id='copy.exchange' defaultMessage='Exchange' />
                </ExchangeHeader>
              )}
              {showWalletHeader && (
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

type Props = {
  loginStep?: LoginSteps
  productAuthMetadata?: ProductAuthMetadata
}

export default Header
