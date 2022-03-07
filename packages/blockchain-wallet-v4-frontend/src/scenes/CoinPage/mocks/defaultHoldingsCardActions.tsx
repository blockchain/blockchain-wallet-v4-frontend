import React, { ReactElement } from 'react'
import { Icon } from '@blockchain-com/constellation'

import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

export const defaultHoldingsCardActions: ReactElement[] = [
  <Button nature='primary' key={1} data-e2e='' fullwidth>
    <Flex gap={10} alignItems='center'>
      <Icon name='cart' color='white900' size='sm' />
      Buy
    </Flex>
  </Button>,
  <Button nature='dark-grey' key={2} data-e2e='' fullwidth>
    <Flex gap={10} alignItems='center'>
      <Icon color='white900' name='qrCode' size='sm' />
      Receive
    </Flex>
  </Button>
]
