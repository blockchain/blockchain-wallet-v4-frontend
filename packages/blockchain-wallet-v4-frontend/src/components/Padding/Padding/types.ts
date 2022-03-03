import { FC } from 'react'

export type PaddingProps = {
  bottom?: number
  left?: number
  right?: number
  top?: number
}

export type PaddingComponent = FC<PaddingProps>
