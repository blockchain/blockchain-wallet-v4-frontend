import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconError } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Icon as BlockchainIcon, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const StyledFlex = styled(Flex)`
  position: relative;
  height: 100%;
  width: 100%;
`

const NftFlyoutFailure: React.FC<Props> = ({ close, error }) => {
  return (
    <StyledFlex flexDirection='column' gap={8} alignItems='center' justifyContent='center'>
      <BlockchainIcon
        onClick={() => close()}
        name='arrow-left'
        cursor
        role='button'
        style={{ left: '40px', position: 'absolute', top: '40px' }}
      />
      <Icon color='red600' label='error'>
        <IconError color='red600' />
      </Icon>
      <Text size='12px' weight={600} style={{ maxHeight: '300px' }}>
        {error}
      </Text>
    </StyledFlex>
  )
}

type Props = {
  close: () => void
  error: string
}

export default NftFlyoutFailure
