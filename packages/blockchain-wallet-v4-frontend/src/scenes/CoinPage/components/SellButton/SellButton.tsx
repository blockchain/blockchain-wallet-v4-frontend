import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconSell, PaletteColors } from '@blockchain-com/constellation'

import { Button } from '../Button'
import { SellButtonComponent } from './SellButton.types'

export const SellButton: SellButtonComponent = ({ disabled, onClick }) => (
  <Button
    nature='dark-grey'
    key={1}
    data-e2e='sellButton'
    disabled={disabled}
    onClick={onClick}
    icon={<IconSell color={PaletteColors['white-900']} label='sell' size='small' />}
  >
    <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
  </Button>
)
