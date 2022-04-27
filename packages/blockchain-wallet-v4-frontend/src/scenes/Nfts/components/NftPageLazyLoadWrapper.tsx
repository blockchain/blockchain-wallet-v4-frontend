import React from 'react'
import styled from 'styled-components'

import { FIXED_HEADER_HEIGHT } from 'layouts/Nfts/NftsHeader'

const Wrapper = styled.div`
  height: calc(100vh - ${FIXED_HEADER_HEIGHT}px);
  overflow: auto;
`

const NftPageLazyLoadWrapper = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

export default NftPageLazyLoadWrapper
