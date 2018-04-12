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

const RightContainer = styled.div`
  margin: 20px 0;

  @media(min-width: 768px) {
    margin: 0;
  }
`

const Footer = () => {
  return (
    <Wrapper>
      <LinkContainer>
        <Image name='blue-logo' height='40px' width='40px' />
        <Link href='https://blockchain.info' size='12px' weight={300} color='white' uppercase>
          <FormattedMessage id='layouts.public.footer.explorer' defaultMessage='.Info Explorer' />
        </Link>
        <Link href='https://blockchain.com/about' size='12px' weight={300} color='white' uppercase>
          <FormattedMessage id='layouts.public.footer.about' defaultMessage='About' />
        </Link>
        <Link href='https://blog.blockchain.com' size='12px' weight={300} color='white' uppercase>
          <FormattedMessage id='layouts.public.footer.blog' defaultMessage='Blog' />
        </Link>
        <Link href='https://support.blockchain.com' size='12px' weight={300} color='white' uppercase>
          <FormattedMessage id='layouts.public.footer.support' defaultMessage='Support' />
        </Link>
      </LinkContainer>
      <RightContainer>
        <DropdownLanguage color='white' />
        <p>Version: {APP_VERSION}</p>
      </RightContainer>
    </Wrapper>
  )
}

export default Footer
