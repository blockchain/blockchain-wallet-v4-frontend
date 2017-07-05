import React from 'react'
import styled from 'styled-components'

import logo from 'img/blue-logo.svg'
import { Container } from 'components/Shared/Grid'
import { Link } from 'components/Shared/Link'

const FooterWrapper = styled.footer`
  background-color: #004A7C;
  height: 100%;
`
const FooterContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`
const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > * { padding: 0 10px; }
`
const Logo = styled.img.attrs({ src: logo })`
  height: 40px;
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
      </FooterContainer>
    </FooterWrapper>
  )
}

export default Footer
