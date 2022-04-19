import { ComponentProps, ReactElement } from 'react'
import { LinePath } from '@visx/shape'

type LinePathComponent = ComponentProps<typeof LinePath>

export type AnimatedLinePathProps<T> = Pick<
  LinePathComponent,
  'stroke' | 'curve' | 'onMouseLeave' | 'onMouseMove' | 'onTouchMove' | 'onTouchStart'
> & {
  data: T[]
  strokeWidth: number
  x: (data: T) => number
  y: (data: T) => number
}

export type AnimatedLinePathComponent = <T extends unknown = unknown>(
  props: AnimatedLinePathProps<T>
) => ReactElement
