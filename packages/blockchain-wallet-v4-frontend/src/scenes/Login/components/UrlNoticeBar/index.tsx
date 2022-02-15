import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import { isMobile, media } from 'services/styles'

const BACKGROUND_COLOR = '#0C6CF2'
const FONT_COLOR = 'white'
const SIZE = isMobile() ? '12px' : '14px'
const BC_URL = 'https://login.blockchain.com'

const Wrapper = styled.div`
  padding: 4px 16px;
  background: ${BACKGROUND_COLOR};
  color: ${FONT_COLOR};
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
  text-align: center;
  ${media.mobile`
    padding: 5px 0;
  `}
`

const StyledText = styled(Text)`
  display: inline;
`

const StyledIcon = styled(Icon)`
  display: inline;
  margin: 0 4px 0 0;
`

const UrlNoticeBar = () => (
  <Wrapper className='url-notice-bar'>
    <StyledText color='white' size={SIZE} weight={500}>
      <FormattedMessage
        id='scenes.login.urlnoticebar.text'
        defaultMessage='Check that the URL is correct.'
      />
    </StyledText>
    <Link color='white' size={SIZE} weight={700} href={BC_URL}>
      <StyledIcon name='padlock' color='white' size='12px' />
      <FormattedMessage id='scenes.login.urlnoticebar.url' defaultMessage={BC_URL} />
    </Link>
  </Wrapper>
)

export default UrlNoticeBar
