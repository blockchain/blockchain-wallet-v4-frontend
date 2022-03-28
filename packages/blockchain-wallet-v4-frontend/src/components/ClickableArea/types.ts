import { FC, MouseEventHandler } from 'react'

export type ClickableAreaProps = {
  onClick?: MouseEventHandler<HTMLDivElement>
}

export type ClickableAreaComponent = FC<ClickableAreaProps>
