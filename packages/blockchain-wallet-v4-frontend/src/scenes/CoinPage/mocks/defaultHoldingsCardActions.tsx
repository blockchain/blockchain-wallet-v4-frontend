import React, { ReactElement } from 'react'
import { Icon, IconName } from '@blockchain-com/constellation'

import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

export const defaultHoldingsCardActions: ReactElement[] = [
  <Button nature='primary' key={1} data-e2e='' fullwidth>
    <Flex gap={10} alignItems='center'>
      <Icon name={IconName.CART} color='currentColor' size='sm' />
      Buy
    </Flex>
  </Button>,
  <Button nature='dark-grey' key={2} data-e2e='' fullwidth>
    <Flex gap={10} alignItems='center'>
      <Icon color='currentColor' name={IconName.QRCODE} size='sm' />
      Receive
    </Flex>
  </Button>
]
