import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Badge, Link } from 'blockchain-info-components'
import DropdownLanguage from 'components/DropdownLanguage'

const Wrapper = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const Bottom = styled.div`
  margin: 16px 0;
  > a {
    margin: 0 8px;
  }
`
const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > a {
    padding: 10px;
  }
`
const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const Footer = () => {
  return (
    <Wrapper>
      <Top>
        <DropdownLanguage color='white' />
        <RightContainer>
          <LinkContainer>
            <Link
              href='https://blockchain.com/explorer'
              size='14px'
              weight={600}
              color='white'
            >
              <FormattedMessage
                id='layouts.public.footer.explorer'
                defaultMessage='Data'
              />
            </Link>
            <Link
              href='https://blockchain.com/about'
              size='14px'
              weight={600}
              color='white'
            >
              <FormattedMessage
                id='layouts.public.footer.about'
                defaultMessage='About'
              />
            </Link>
            <Link
              href='https://blog.blockchain.com'
              size='14px'
              weight={600}
              color='white'
            >
              <FormattedMessage
                id='layouts.public.footer.blog'
                defaultMessage='Blog'
              />
            </Link>
            <Link
              href='https://support.blockchain.com'
              size='14px'
              weight={600}
              color='white'
            >
              <FormattedMessage
                id='layouts.public.footer.support'
                defaultMessage='Support'
              />
            </Link>
          </LinkContainer>
        </RightContainer>
      </Top>
      <Bottom>
        <Badge type='applestore' />
        <Badge type='googleplay' />
      </Bottom>
    </Wrapper>
  )
}

export default Footer
