import React from 'react'
import styled from 'styled-components'

import DropdownLanguage from 'components/Shared/DropdownLanguage'
import { Container, Row, Col } from 'components/Shared/Grid'
import { Link, NavLink } from 'components/Shared/Link'
import { Text } from 'components/Shared/Text'

import logo from 'img/blockchain-blue.svg'

const FooterWrapper = styled.div`
  background-color: #E3EFF5;
  padding: 40px;
`
const FooterLogo = styled.img.attrs({
  src: logo
})`
  height: 20px;
`
const FooterHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 0;
`
const FooterCopyright = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: auto;
  padding: 20px 0;
  text-align: center;

  @media(min-width: 768px) {
    flex-direction: row;
    width: 650px; 
  }
`

const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <Row>
          <Col>
            <FooterHeader>
              <FooterLogo />
              <DropdownLanguage />
            </FooterHeader>
          </Col>
        </Row>
        <Row>
          <Col lg={{ size: 2, offset: 4 }} md={{ size: 3, offset: 2 }} xs={4}>
            <Text id='components.layouts.landing.footer.products' text='Products' small uppercase cyan />
            <NavLink id='components.layouts.landing.footer.wallet' text='Wallet' to='/wallet' />
            <Link id='components.layouts.landing.footer.business' text='Business' href='https://blockchain.com/enterprise' small uppercase />
            <Link id='components.layouts.landing.footer.research' text='Research' href='https://blockchain.com/research' small uppercase />
            <Link id='components.layouts.landing.footer.explorer' text='.Info Explorer' href='https://blockchain.info' small uppercase />
            <Link id='components.layouts.landing.footer.support' text='Support' href='https://support.blockchain.com' small uppercase />
          </Col>
          <Col lg={2} md={3} xs={4}>
            <Text id='components.layouts.landing.footer.company' text='Company' small uppercase cyan />
            <Link id='components.layouts.landing.footer.about' text='About' href='https://blockchain.com/about' small uppercase />
            <Link id='components.layouts.landing.footer.team' text='Team' href='https://blockchain.com/team' small uppercase />
            <Link id='components.layouts.landing.footer.careers' text='Careers' href='https://blockchain.com/careers' small uppercase />
            <Link id='components.layouts.landing.footer.interviewing' text='Interviewing' href='https://blockchain.com/interview' small uppercase />
            <Link id='components.layouts.landing.footer.faq' text='Faq' href='https://blockchain.com/faq' small uppercase />
          </Col>
          <Col lg={2} md={3} xs={4}>
            <Text id='components.layouts.landing.footer.news' text='News' small uppercase cyan />
            <Link id='components.layouts.landing.footer.press' text='Press' href='https://blockchain.com/press' small uppercase />
            <Link id='components.layouts.landing.footer.blog' text='Blog' href='https://blog.blockchain.com' small uppercase />
          </Col>
        </Row>
        <Row>
          <Col xs='auto'>
            <FooterCopyright>
              <Text id='components.layouts.landing.footer.copyright' text='2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.' smaller uppercase />
              <Link id='components.layouts.landing.footer.privacy' text='Privacy' href='https://blockchain.com/privacy' target='_blank' smaller uppercase />
              <Link id='components.layouts.landing.footer.terms' text='Terms' href='https://blockchain.com/terms' target='_blank' smaller uppercase />
              <Link id='components.layouts.landing.footer.enforcement' text='Law enforcement guide' href='https://blockchain.com/legal' target='_blank' smaller uppercase />
            </FooterCopyright>
          </Col>
        </Row>
      </Container>
    </FooterWrapper>
  )
}

export default Footer
