import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, IconName } from '@blockchain-com/constellation'

import { Button } from '../Button'
import { SellButtonComponent } from './SellButton.types'

export const SellButton: SellButtonComponent = ({ disabled, onClick }) => (
  <Button
    nature='dark-grey'
    key={1}
    data-e2e='sellButton'
    disabled={disabled}
    onClick={onClick}
    icon={<Icon name={IconName.SELL} color='white' size='sm' />}
  >
    <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
  </Button>
)
