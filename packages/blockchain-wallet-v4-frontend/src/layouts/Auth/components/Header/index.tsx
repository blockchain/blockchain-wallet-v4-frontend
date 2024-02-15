import React from 'react'
import styled from 'styled-components'

import { Image, Link } from 'blockchain-info-components'
import { ServiceAnnouncement } from 'components/Announcements'
import { Brand, Public } from 'components/Navbar'
import { isMobile, media } from 'services/styles'

const qsParams = new URLSearchParams(window.location.hash)
const isLatam = qsParams.has('latam')
const isSofi = window.location.hash.includes('sofi')

const NavbarStyled = styled(Public)<{ authProduct: string }>`
  padding: 0 16px;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.authProduct === 'EXCHANGE'
      ? props.theme.exchangeLogin
      : isLatam
      ? '#04001F'
      : props.theme.grey900};
  background-image: ${(props) =>
    props.authProduct !== 'EXCHANGE' && isLatam
      ? `url('/img/bg-pattern-latam.svg')`
      : `url('/img/bg-pattern.svg')`};
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
const BlockchainSofiLogoImage = styled(Image)`
  width: 375 px;
  display: block;
  ${media.tablet`
    width: 275px;
  `}
`
const AuthBrand = styled.div`
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
  const nabvarHeight = isSofi && isMobile() ? '55px' : '112px'
  return (
    <>
      <NavbarStyled height={nabvarHeight} authProduct={props.authProduct}>
        <NavbarBrandStyled>
          <AuthBrand>
            <HeaderLink href='https://www.blockchain.com'>
              {isLatam && <BlockchainLogoImage name='sesocio-to-blockchain-logo' height='70px' />}{' '}
              {isSofi && <BlockchainSofiLogoImage name='blockchain-sofi-logo' height='24px' />}
              {!isLatam && !isSofi && <BlockchainLogoImage name='blockchain-logo' height='24px' />}
            </HeaderLink>
          </AuthBrand>
        </NavbarBrandStyled>
      </NavbarStyled>
      <ServiceAnnouncement alertArea='public' />
    </>
  )
}

export default Header
