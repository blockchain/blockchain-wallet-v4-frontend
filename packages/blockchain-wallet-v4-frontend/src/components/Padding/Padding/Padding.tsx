import React from 'react'

import { AllPadding } from '../AllPadding'
import { SymetricPadding } from '../SymetricPadding'
import { PaddingComponent } from './types'

export const Padding: PaddingComponent = ({ bottom, children, left, right, top }) => {
  return (
    <div
      style={{
        paddingBottom: bottom,
        paddingLeft: left,
        paddingRight: right,
        paddingTop: top
      }}
    >
      {children}
    </div>
  )
}

Padding.Symetric = SymetricPadding
Padding.All = AllPadding
