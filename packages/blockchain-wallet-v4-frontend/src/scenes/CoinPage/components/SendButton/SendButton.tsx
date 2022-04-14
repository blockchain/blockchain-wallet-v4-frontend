import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconSell } from '@blockchain-com/icons'

import { Button } from '../Button'
import { SendButtonComponent } from './SendButton.types'

export const SendButton: SendButtonComponent = ({ disabled, onClick }) => {
  return (
    <Button
      icon={
        <Icon label='sell' color='white900' size='sm'>
          <IconSell />
        </Icon>
      }
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
