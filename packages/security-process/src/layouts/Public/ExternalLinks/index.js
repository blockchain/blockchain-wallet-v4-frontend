import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Link } from 'blockchain-info-components'
import DropdownLanguage from 'components/DropdownLanguage'
import media from 'services/ResponsiveService'

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
const Wrapper = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  ${media.mobile`
    flex-direction: column;
    margin-top: 8px;
  `}
`
const ExternalLinks = () => {
  return (
    <Wrapper>
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
    </Wrapper>
  )
}

export default ExternalLinks
