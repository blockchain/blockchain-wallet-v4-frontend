import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  overflow: auto;
`

const NftPageLazyLoadWrapper = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

export default NftPageLazyLoadWrapper
