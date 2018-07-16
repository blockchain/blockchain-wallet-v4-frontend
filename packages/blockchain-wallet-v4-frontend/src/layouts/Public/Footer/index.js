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
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  & > :last-child {
    padding: 2px;
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
        <Link href='https://blockchain.info' size='12px' weight={300} color='white' uppercase>
          <FormattedMessage id='layouts.public.footer.explorer' defaultMessage='Data' />
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
        <Link href='https://github.com/blockchain/blockchain-wallet-v4-frontend/releases' target="_blank" size='12px' weight={100} color='white'>
          v{APP_VERSION}
        </Link>
      </RightContainer>
    </Wrapper>
  )
}

export default Footer
