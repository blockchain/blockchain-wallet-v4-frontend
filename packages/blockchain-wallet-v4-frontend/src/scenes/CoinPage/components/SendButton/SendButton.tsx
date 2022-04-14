import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, IconName } from '@blockchain-com/constellation'

import { Button } from '../Button'
import { SendButtonComponent } from './SendButton.types'

export const SendButton: SendButtonComponent = ({ disabled, onClick }) => {
  return (
    <Button
      icon={<Icon name={IconName.SELL} color='white' size='sm' />}
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
