import React from 'react'
import styled from 'styled-components'

import { SpinningLoader } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const StyledFlex = styled(Flex)`
  height: 100%;
  width: 100%;
`

const NftFlyoutLoader: React.FC<Props> = () => {
  return (
    <StyledFlex alignItems='center' justifyContent='center'>
      <SpinningLoader width='14px' height='14px' borderWidth='3px' />
    </StyledFlex>
  )
}

type Props = {}

export default NftFlyoutLoader
