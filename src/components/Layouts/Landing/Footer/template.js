import React from 'react'
import styled from 'styled-components'

import { Grid, Link, RouterLink, Text } from 'blockchain-info-components'
import DropdownLanguage from 'components/shared/DropdownLanguage'

import logo from 'img/blockchain-blue.svg'

const Wrapper = styled.div`
  background-color: #E3EFF5;
  padding: 40px;
`
const Container = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
const Top = styled.div`
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
const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const Logo = styled.img.attrs({
  src: logo
})`
  display: flex;
  height: 20px;
  margin-bottom: 20px;
`
const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  & > a { padding: 5px 0; }
`
const DropdownContainer = styled.div`
  display: flex;
  margin-top: 20px;

  & .btn-primary {
    font-weight: 400;
    font-size: 0.9rem;
    text-transform: uppercase;
    background-color: transparent!important;
    color: #10ADE4!important;
    border: none!important;
    padding: 0;
  }

  @media(min-width: 768px) {
    margin: 0;
  }
`
const CopyrightContainer = styled.div`
  text-align: center;
  padding: 30px 0;

  & > div, a {
    display: inline-block;
    padding: 0 10px;
  }
`
const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <Top>
          <Logo />
          <LinkContainer>
            <Text id='components.layouts.landing.footer.products' text='Products' small uppercase cyan />
            <RouterLink to='/wallet'><Text id='components.layouts.landing.footer.wallet' text='Wallet' small uppercase /></RouterLink>
            <Link href='https://blockchain.com/enterprise'><Text id='components.layouts.landing.footer.business' text='Business' small uppercase /></Link>
            <Link href='https://blockchain.com/research'><Text id='components.layouts.landing.footer.research' text='Research' small uppercase /></Link>
            <Link href='https://blockchain.info'><Text id='components.layouts.landing.footer.explorer' text='.Info Explorer' small uppercase /></Link>
            <Link href='https://support.blockchain.com'><Text id='components.layouts.landing.footer.support' text='Support' small uppercase /></Link>
          </LinkContainer>
          <LinkContainer>
            <Text id='components.layouts.landing.footer.company' text='Company' small uppercase cyan />
            <Link href='https://blockchain.com/about'><Text id='components.layouts.landing.footer.about' text='About' small uppercase /></Link>  
            <Link href='https://blockchain.com/team'><Text id='components.layouts.landing.footer.team' text='Team' small uppercase /></Link>
            <Link href='https://blockchain.com/careers'><Text id='components.layouts.landing.footer.careers' text='Careers'small uppercase /></Link>
            <Link href='https://blockchain.com/interview'><Text id='components.layouts.landing.footer.interviewing' text='Interviewing' small uppercase /></Link>
            <Link href='https://blockchain.com/faq'><Text id='components.layouts.landing.footer.faq' text='Faq' small uppercase /></Link>
          </LinkContainer>
          <LinkContainer>
            <Text id='components.layouts.landing.footer.news' text='News' small uppercase cyan />
            <Link href='https://blockchain.com/press'><Text id='components.layouts.landing.footer.press' text='Press'small uppercase /></Link>
            <Link href='https://blog.blockchain.com'><Text id='components.layouts.landing.footer.blog' text='Blog' small uppercase /></Link>
          </LinkContainer>
          <DropdownContainer>
            <DropdownLanguage />
          </DropdownContainer>
        </Top>
        <Bottom>
          <CopyrightContainer>
            <Text id='components.layouts.landing.footer.copyright' text='2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.' smaller uppercase />
            <Link href='https://blockchain.com/privacy' target='_blank'><Text id='components.layouts.landing.footer.privacy' text='Privacy' smaller uppercase /></Link>
            <Link href='https://blockchain.com/terms' target='_blank'><Text id='components.layouts.landing.footer.terms' text='Terms' smaller uppercase /></Link>
            <Link href='https://blockchain.com/legal' target='_blank'><Text id='components.layouts.landing.footer.enforcement' text='Law enforcement guide' smaller uppercase /></Link>
          </CopyrightContainer>
        </Bottom>
      </Container>
    </Wrapper>
  )
}

export default Footer
