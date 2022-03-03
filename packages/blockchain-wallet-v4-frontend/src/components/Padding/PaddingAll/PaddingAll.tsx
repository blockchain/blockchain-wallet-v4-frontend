import React from 'react'

import { Padding } from '../Padding'
import { PaddingAllComponent } from './types'

export const PaddingAll: PaddingAllComponent = ({ children, size }) => (
  <Padding top={size} bottom={size} left={size} right={size}>
    {children}
  </Padding>
)
