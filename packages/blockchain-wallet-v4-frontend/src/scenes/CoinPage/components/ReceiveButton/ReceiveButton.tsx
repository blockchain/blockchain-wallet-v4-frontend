import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, IconName } from '@blockchain-com/constellation'

import { Button } from '../Button'
import { ReceiveButtonComponent } from './ReceiveButton.types'

export const ReceiveButton: ReceiveButtonComponent = ({ onClick }) => (
  <Button
    nature='dark-grey'
    data-e2e='receiveButton'
    onClick={onClick}
    icon={<Icon color='white' name={IconName.QRCODE} size='sm' />}
  >
    <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
  </Button>
)
