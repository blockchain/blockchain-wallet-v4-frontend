import { FC } from 'react'

export type TooltipProps = {
  left: number
  offsetLeft?: number
  offsetTop?: number
  top: number
}

export type TooltipComponent = FC<TooltipProps>
