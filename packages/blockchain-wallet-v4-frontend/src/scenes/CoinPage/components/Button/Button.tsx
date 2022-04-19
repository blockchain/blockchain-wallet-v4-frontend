import React from 'react'

import { Button as InfoButton } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { ButtonComponent } from './Button.types'

export const Button: ButtonComponent = ({
  children,
  'data-e2e': e2e,
  disabled,
  icon,
  nature,
  onClick
}) => (
  <InfoButton nature={nature} data-e2e={e2e} fullwidth disabled={disabled} onClick={onClick}>
    <Flex gap={10} alignItems='center'>
      {icon}
      {children}
    </Flex>
  </InfoButton>
)
