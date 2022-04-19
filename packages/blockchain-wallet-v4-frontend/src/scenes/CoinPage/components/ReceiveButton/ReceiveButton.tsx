import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconQrCode } from '@blockchain-com/icons'

import { Button } from '../Button'
import { ReceiveButtonComponent } from './ReceiveButton.types'

export const ReceiveButton: ReceiveButtonComponent = ({ onClick }) => (
  <Button
    nature='dark-grey'
    data-e2e='receiveButton'
    onClick={onClick}
    icon={
      <Icon label='qr-code' color='white900' size='sm'>
        <IconQrCode />
      </Icon>
    }
  >
    <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
  </Button>
)
