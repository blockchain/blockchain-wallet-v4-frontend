import React from 'react'
import styled from 'styled-components'

import { Container } from 'components/Shared/Grid'
import { Link, NavLink } from 'components/Shared/Link'
import { Text } from 'components/Shared/Text'
import DropdownLanguage from './DropdownLanguage'

import logo from 'img/blockchain-blue.svg'

const FooterWrapper = styled.div`
  background-color: #E3EFF5;
  padding: 40px;
`
const FooterContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
const FooterTop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 100%;

  @media(min-width: 768px) { 
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`
const FooterBottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const FooterLogo = styled.img.attrs({
  src: logo
})`
  display: flex;
  height: 20px;
  margin-bottom: 20px;
`
const FooterLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const FooterDropdown = styled.div`
  display: flex;
  margin-top: 20px;
  cursor: pointer;

  & > div > a {
    font-family: 'Montserrat', Helvetica, sans-serif;
    font-weight: 400;
    font-size: 0.9rem;
    text-transform: uppercase;
    color: #10ADE4!important;
  }

  @media(min-width: 768px) {
    margin: 0;
  }
`
const FooterCopyright = styled.div`
  text-align: center;
  padding: 30px 0;

  & > div, a {
    display: inline-block;
    padding: 0 10px;
  }
`
const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterTop>
          <FooterLogo />
          <FooterLinkContainer>
            <Text id='components.layouts.landing.footer.products' text='Products' small uppercase cyan />
            <NavLink id='components.layouts.landing.footer.wallet' text='Wallet' to='/wallet' />
            <Link id='components.layouts.landing.footer.business' text='Business' href='https://blockchain.com/enterprise' small uppercase />
            <Link id='components.layouts.landing.footer.research' text='Research' href='https://blockchain.com/research' small uppercase />
            <Link id='components.layouts.landing.footer.explorer' text='.Info Explorer' href='https://blockchain.info' small uppercase />
            <Link id='components.layouts.landing.footer.support' text='Support' href='https://support.blockchain.com' small uppercase />
          </FooterLinkContainer>
          <FooterLinkContainer>
            <Text id='components.layouts.landing.footer.company' text='Company' small uppercase cyan />
            <Link id='components.layouts.landing.footer.about' text='About' href='https://blockchain.com/about' small uppercase />
            <Link id='components.layouts.landing.footer.team' text='Team' href='https://blockchain.com/team' small uppercase />
            <Link id='components.layouts.landing.footer.careers' text='Careers' href='https://blockchain.com/careers' small uppercase />
            <Link id='components.layouts.landing.footer.interviewing' text='Interviewing' href='https://blockchain.com/interview' small uppercase />
            <Link id='components.layouts.landing.footer.faq' text='Faq' href='https://blockchain.com/faq' small uppercase />
          </FooterLinkContainer>
          <FooterLinkContainer>
            <Text id='components.layouts.landing.footer.news' text='News' small uppercase cyan />
            <Link id='components.layouts.landing.footer.press' text='Press' href='https://blockchain.com/press' small uppercase />
            <Link id='components.layouts.landing.footer.blog' text='Blog' href='https://blog.blockchain.com' small uppercase />
          </FooterLinkContainer>
          <FooterDropdown>
            <DropdownLanguage />
          </FooterDropdown>
        </FooterTop>
        <FooterBottom>
          <FooterCopyright>
            <Text id='components.layouts.landing.footer.copyright' text='2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.' smaller uppercase />
            <Link id='components.layouts.landing.footer.privacy' text='Privacy' href='https://blockchain.com/privacy' target='_blank' smaller uppercase />
            <Link id='components.layouts.landing.footer.terms' text='Terms' href='https://blockchain.com/terms' target='_blank' smaller uppercase />
            <Link id='components.layouts.landing.footer.enforcement' text='Law enforcement guide' href='https://blockchain.com/legal' target='_blank' smaller uppercase />
          </FooterCopyright>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  )
}

export default Footer
