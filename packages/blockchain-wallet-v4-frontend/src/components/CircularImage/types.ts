import { FC } from 'react'

export type CircularImageRadius = 'small' | 'medium' | 'large' | number

export type CircularImageProps = {
  alt?: string
  radius?: CircularImageRadius
  src: string
}

export type CircularImageComponent = FC<CircularImageProps>
