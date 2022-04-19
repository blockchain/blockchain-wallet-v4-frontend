import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconCart } from '@blockchain-com/icons'

import { Button } from '../Button'
import { BuyButtonComponent } from './BuyButton.types'

export const BuyButton: BuyButtonComponent = ({ onClick }) => (
  <Button
    nature='primary'
    key={1}
    data-e2e='buyButton'
    onClick={onClick}
    icon={
      <Icon label='cart' color='white900' size='sm'>
        <IconCart />
      </Icon>
    }
  >
    <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
  </Button>
)
