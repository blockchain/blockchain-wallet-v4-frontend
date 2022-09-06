import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconCart, PaletteColors } from '@blockchain-com/constellation'

import { Button } from '../Button'
import { BuyButtonComponent } from './BuyButton.types'

export const BuyButton: BuyButtonComponent = ({ onClick }) => (
  <Button
    nature='primary'
    key={1}
    data-e2e='buyButton'
    onClick={onClick}
    icon={<IconCart color={PaletteColors['white-900']} label='cart' size='small' />}
  >
    <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
  </Button>
)
