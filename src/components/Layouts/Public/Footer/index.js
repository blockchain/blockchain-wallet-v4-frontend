import React from 'react'
import styled from 'styled-components'

import logo from 'img/blue-logo.svg'
import { Link, Text } from 'blockchain-components'
import DropdownLanguage from 'components/shared/DropdownLanguage'

const Wrapper = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 60px;
  background-color: #004A7C;

  @media(min-width: 768px) { 
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const Logo = styled.img.attrs({ src: logo })`
  height: 40px;
  width: 40px;
`
const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  & > a { padding: 10px; }

  @media(min-width: 768px) { 
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const DropdownContainer = styled.div`
  margin: 20px 0;

  & .btn-primary {
    font-weight: 300;
    font-size: 0.9rem;
    text-transform: uppercase;
    background-color: transparent!important;
    color: #FFFFFF!important;
    border: none!important;
    padding: 0;
  }

  @media(min-width: 768px) {
    margin: 0;
  }
`

const Footer = () => {
  return (
    <Wrapper>
      <LinkContainer>
        <Logo />
        <Link href='https://blockchain.info'><Text id='components.layouts.public.footer.explorer' text='.Info Explorer' small light uppercase white /></Link>
        <Link href='https://blockchain.com/about'><Text id='components.layouts.public.footer.about' text='About' small light uppercase white /></Link>
        <Link href='https://blog.blockchain.com'><Text id='components.layouts.public.footer.blog' text='Blog' small light uppercase white /></Link>
        <Link href='https://support.blockchain.com'><Text id='components.layouts.public.footer.support' text='Support' small light uppercase white /></Link>
      </LinkContainer>
      <DropdownContainer>
        <DropdownLanguage />
      </DropdownContainer>
    </Wrapper>
  )
}

export default Footer
