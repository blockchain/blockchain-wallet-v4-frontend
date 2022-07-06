import React from 'react'
import styled from 'styled-components'

import { Icon as BlockchainIcon, SpinningLoader } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const StyledFlex = styled(Flex)`
  height: 100%;
  width: 100%;
`

const NftFlyoutLoader: React.FC<Props> = ({ close }) => {
  return (
    <StyledFlex alignItems='center' justifyContent='center'>
      <BlockchainIcon
        onClick={() => close()}
        name='arrow-left'
        cursor
        role='button'
        style={{ left: '40px', position: 'absolute', top: '40px' }}
      />
      <SpinningLoader width='14px' height='14px' borderWidth='3px' />
    </StyledFlex>
  )
}

type Props = {
  close: () => void
}

export default NftFlyoutLoader
