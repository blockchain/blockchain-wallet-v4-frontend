import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconQrCode, PaletteColors } from '@blockchain-com/constellation'

import { Button } from '../Button'
import { ReceiveButtonComponent } from './ReceiveButton.types'

export const ReceiveButton: ReceiveButtonComponent = ({ onClick }) => (
  <Button
    nature='dark-grey'
    data-e2e='receiveButton'
    onClick={onClick}
    icon={<IconQrCode color={PaletteColors['white-900']} label='qr-code' size='small' />}
  >
    <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
  </Button>
)
