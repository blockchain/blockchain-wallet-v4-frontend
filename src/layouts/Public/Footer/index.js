import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Image, Link } from 'blockchain-info-components'
import DropdownLanguage from 'components/DropdownLanguage'

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
        <Image name='blue-logo' height='40px' width='40px' />
        <Link href='https://blockchain.info' uppercase white>
          <FormattedMessage id='components.layouts.public.footer.explorer' defaultMessage='.Info Explorer' />
        </Link>
        <Link href='https://blockchain.com/about' uppercase white>
          <FormattedMessage id='components.layouts.public.footer.about' defaultMessage='About' />
        </Link>
        <Link href='https://blog.blockchain.com' uppercase white>
          <FormattedMessage id='components.layouts.public.footer.blog' defaultMessage='Blog' />
        </Link>
        <Link href='https://support.blockchain.com' uppercase white>
          <FormattedMessage id='components.layouts.public.footer.support' defaultMessage='Support' />
        </Link>
      </LinkContainer>
      <DropdownContainer>
        <DropdownLanguage />
      </DropdownContainer>
    </Wrapper>
  )
}

export default Footer
