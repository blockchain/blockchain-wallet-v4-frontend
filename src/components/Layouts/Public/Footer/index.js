import React from 'react'
import styled from 'styled-components'

import logo from 'img/blue-logo.svg'
import { Grid } from 'components/Shared/Grid'
import { Link } from 'components/Shared/Link'
import DropdownLanguage from './DropdownLanguage'

const FooterWrapper = styled.footer`
  background-color: #004A7C;
  padding: 15px 0;
`
const FooterContainer = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media(min-width: 768px) { 
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  & > * { padding: 0 10px; }

  @media(min-width: 768px) { 
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const Logo = styled.img.attrs({ src: logo })`
  height: 40px;
`
const FooterDropdown = styled.div`
  display: flex;
  margin-top: 20px;
  cursor: pointer;

  & > div > a {
    font-family: 'Montserrat', Helvetica, sans-serif;
    font-weight: 300;
    text-transform: uppercase;
    color: #FFFFFF!important;
  }

  @media(min-width: 768px) {
    margin: 0;
  }
`

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <LinkContainer>
          <Logo />
          <Link id='components.layouts.public.footer.explorer' text='.Info Explorer' href='https://blockchain.info' light uppercase white />
          <Link id='components.layouts.public.footer.about' text='About' href='https://blockchain.com/about' light uppercase white />
          <Link id='components.layouts.public.footer.blog' text='Blog' href='https://blog.blockchain.com' light uppercase white />
          <Link id='components.layouts.public.footer.support' text='Support' href='https://support.blockchain.com' light uppercase white />
        </LinkContainer>
        <FooterDropdown>
          <DropdownLanguage />
        </FooterDropdown>
      </FooterContainer>
    </FooterWrapper>
  )
}

export default Footer
