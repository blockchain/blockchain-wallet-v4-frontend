import React, { ReactElement } from 'react'
import { IconCart, IconQrCode, PaletteColors } from '@blockchain-com/constellation'

import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

export const defaultHoldingsCardActions: ReactElement[] = [
  <Button nature='primary' key={1} data-e2e='' fullwidth>
    <Flex gap={10} alignItems='center'>
      <IconCart color={PaletteColors['white-900']} label='cart' size='small' />
      Buy
    </Flex>
  </Button>,
  <Button nature='dark-grey' key={2} data-e2e='' fullwidth>
    <Flex gap={10} alignItems='center'>
      <IconQrCode color={PaletteColors['white-900']} label='qr-code' size='small' />
      Receive
    </Flex>
  </Button>
]
