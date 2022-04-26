import React from 'react'
import styled from 'styled-components'

import { Image, Link } from 'blockchain-info-components'
import Announcements from 'components/Announcements'
import { Brand, Public } from 'components/NavbarV2'
import { media } from 'services/styles'

const qsParams = new URLSearchParams(window.location.hash)
const isLatam = qsParams.has('latam')

const NavbarStyled = styled(Public)<{ authProduct: string }>`
  padding: 0 16px;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.authProduct === 'EXCHANGE'
      ? props.theme.exchangeLogin
      : isLatam
      ? '#020109'
      : props.theme.grey900};
  background-image: ${(props) =>
    props.authProduct !== 'EXCHANGE' && isLatam ? 'none' : `url('/img/bg-pattern.svg')`};
`
const NavbarBrandStyled = styled(Brand)`
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
const HeaderLink = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const Header = (props) => {
  return (
    <>
      <NavbarStyled height='112px' authProduct={props.authProduct}>
        <NavbarBrandStyled>
          <PublicBrand>
            <HeaderLink href='https://www.blockchain.com'>
              {isLatam ? (
                <BlockchainLogoImage name='sesocio-to-blockchain-logo' height='70px' />
              ) : (
                <BlockchainLogoImage name='blockchain-logo' height='24px' />
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
