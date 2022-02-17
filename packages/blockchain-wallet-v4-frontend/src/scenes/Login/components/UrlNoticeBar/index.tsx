import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const BC_URL = 'https://login.blockchain.com'

const Wrapper = styled.div`
  padding: 0.25rem 1rem;
  background: ${(props) => props.theme.blue600};
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
  text-align: center;
  ${media.mobile`
    padding: 0.25rem 0;
  `}
`

const StyledText = styled(Text)`
  display: inline;
  font-size: 0.875rem;
  ${media.mobile`
    font-size: 0.75rem;
  `}
`

const StyledLink = styled(Link)`
  font-size: 0.875rem;
  ${media.mobile`
    font-size: 0.75rem;
  `}
`

const StyledIcon = styled(Icon)`
  display: inline;
  margin: 0 0.25rem 0 0;
`

const UrlNoticeBar = () => (
  <Wrapper className='url-notice-bar'>
    <StyledText color='white' weight={500}>
      <FormattedMessage
        id='scenes.login.url_notice_bar.text'
        defaultMessage='Check that the URL is correct.'
      />
    </StyledText>
    <StyledLink color='white' weight={700} href={BC_URL}>
      <StyledIcon name='padlock' color='white' size='12px' />
      {BC_URL}
    </StyledLink>
  </Wrapper>
)

export default UrlNoticeBar
