import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, IconName } from '@blockchain-com/constellation'

import { Button } from '../Button'
import { BuyButtonComponent } from './BuyButton.types'

export const BuyButton: BuyButtonComponent = ({ onClick }) => (
  <Button
    nature='primary'
    key={1}
    data-e2e='buyButton'
    onClick={onClick}
    icon={<Icon name={IconName.CART} color='white' size='sm' />}
  >
    <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
  </Button>
)
