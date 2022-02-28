import React from 'react'

import { Padding } from '../Padding'
import { SymetricPaddingComponent } from './types'

export const SymetricPadding: SymetricPaddingComponent = ({ children, horizontal, vertical }) => {
  return (
    <Padding top={vertical} bottom={vertical} left={horizontal} right={horizontal}>
      {children}
    </Padding>
  )
}
