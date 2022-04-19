import { FC } from 'react'

export type TabsProps = {
  direction?: 'horizontal' | 'vertical'
  gap?: number
}

export type TabsComponent = FC<TabsProps>
