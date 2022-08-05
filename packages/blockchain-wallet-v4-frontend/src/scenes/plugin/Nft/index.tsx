import React from 'react'
import styled from 'styled-components'

import { Flex } from 'components/Flex'

import { NoNfts } from './NoNfts'

const Wrapper = styled(Flex)`
  height: 100%;
  flex-direction: column;
`

const Nft = () => {
  return (
    <Wrapper>
      <NoNfts />
    </Wrapper>
  )
}

export default Nft
