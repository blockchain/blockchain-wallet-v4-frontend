import { CSSProperties, FC } from 'react'

export type ExpandedProps = {
  grow?: number
  style?: CSSProperties
}

export type ExpandedComponent = FC<ExpandedProps>
