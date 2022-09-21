import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconSell, PaletteColors } from '@blockchain-com/constellation'

import { Button } from '../Button'
import { SendButtonComponent } from './SendButton.types'

export const SendButton: SendButtonComponent = ({ disabled, onClick }) => {
  return (
    <Button
      icon={<IconSell color={PaletteColors['white-900']} label='sell' size='small' />}
      nature='dark-grey'
      key={1}
      data-e2e='sellButton'
      disabled={disabled}
      onClick={onClick}
    >
      <FormattedMessage id='buttons.send' defaultMessage='Send' />
    </Button>
  )
}
