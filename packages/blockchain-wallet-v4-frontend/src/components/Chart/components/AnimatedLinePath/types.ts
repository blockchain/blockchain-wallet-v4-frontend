import { ComponentProps, ReactElement } from 'react'
import { LinePath } from '@visx/shape'

type LinePathComponent = ComponentProps<typeof LinePath>

export type AnimatedLinePathProps<DATA> = Pick<
  LinePathComponent,
  'stroke' | 'curve' | 'onMouseLeave' | 'onMouseMove' | 'onTouchMove' | 'onTouchStart'
> & {
  data: DATA[]
  strokeWidth: number
  x: (data: DATA) => number
  y: (data: DATA) => number
}

export type AnimatedLinePathComponent = <DATA extends unknown = unknown>(
  props: AnimatedLinePathProps<DATA>
) => ReactElement
