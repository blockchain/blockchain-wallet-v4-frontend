import React from 'react'

import { Padding } from '../Padding'
import { PaddingSymetricComponent } from './types'

export const PaddingSymetric: PaddingSymetricComponent = ({ children, horizontal, vertical }) => {
  return (
    <Padding top={vertical} bottom={vertical} left={horizontal} right={horizontal}>
      {children}
    </Padding>
  )
}
