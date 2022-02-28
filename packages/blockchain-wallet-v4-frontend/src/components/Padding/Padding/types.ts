import { FC } from 'react'

import { AllPaddingComponent } from '../AllPadding'
import { SymetricPaddingComponent } from '../SymetricPadding'

export type PaddingProps = {
  bottom?: number
  left?: number
  right?: number
  top?: number
}

export type PaddingComponent = FC<PaddingProps> & {
  All: AllPaddingComponent
  Symetric: SymetricPaddingComponent
}
