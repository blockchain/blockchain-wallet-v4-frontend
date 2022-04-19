import React, { ReactElement } from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconCart, IconQrCode } from '@blockchain-com/icons'

import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

export const defaultHoldingsCardActions: ReactElement[] = [
  <Button nature='primary' key={1} data-e2e='' fullwidth>
    <Flex gap={10} alignItems='center'>
      <Icon label='cart' size='sm' color='white900'>
        <IconCart />
      </Icon>
      Buy
    </Flex>
  </Button>,
  <Button nature='dark-grey' key={2} data-e2e='' fullwidth>
    <Flex gap={10} alignItems='center'>
      <Icon label='qr-code' size='sm' color='white900'>
        <IconQrCode />
      </Icon>
      Receive
    </Flex>
  </Button>
]
