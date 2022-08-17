import { FC } from 'react'

export type TagVariant = 'warning' | 'error'

export type TagProps = {
  variant: TagVariant
}

export type TagComponent = FC<TagProps>
