import React from 'react'
import styled from 'styled-components'

import { Badge } from 'blockchain-info-components'
import media from 'services/ResponsiveService'

const Wrapper = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 100%;
  ${media.mobile`
    img {
      height: auto;
      width: 40%;
    }
  `}
`
const Bottom = styled.div`
  margin: 16px 0;
  > a {
    margin: 0 8px;
  }
`

const Footer = () => {
  return (
    <Wrapper>
      <Bottom>
        <Badge type='applestore' />
        <Badge type='googleplay' />
      </Bottom>
    </Wrapper>
  )
}

export default Footer
