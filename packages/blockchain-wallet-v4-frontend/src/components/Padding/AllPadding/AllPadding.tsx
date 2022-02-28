import React from 'react'

import { Padding } from '../Padding'
import { AllPaddingComponent } from './types'

export const AllPadding: AllPaddingComponent = ({ children, size }) => (
  <Padding top={size} bottom={size} left={size} right={size}>
    {children}
  </Padding>
)
