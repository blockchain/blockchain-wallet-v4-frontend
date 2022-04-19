import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconSell } from '@blockchain-com/icons'

import { Button } from '../Button'
import { SellButtonComponent } from './SellButton.types'

export const SellButton: SellButtonComponent = ({ disabled, onClick }) => (
  <Button
    nature='dark-grey'
    key={1}
    data-e2e='sellButton'
    disabled={disabled}
    onClick={onClick}
    icon={
      <Icon label='sell' color='white900' size='sm'>
        <IconSell />
      </Icon>
    }
  >
    <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
  </Button>
)
