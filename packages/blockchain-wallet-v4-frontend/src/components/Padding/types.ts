import { FC } from 'react'

export type PaddingVertical =
  | {
      all?: never
      bottom?: never
      top?: never
      vertical?: number
    }
  | {
      all?: never
      bottom?: number
      top?: number
      vertical?: never
    }
  | {
      all?: number
      bottom?: never
      top?: never
      vertical?: never
    }

export type PaddingHorizontal =
  | {
      all?: never
      horizontal?: number
      left?: never
      right?: never
    }
  | {
      all?: never
      horizontal?: never
      left?: number
      right?: number
    }
  | {
      all?: number
      horizontal?: never
      left?: never
      right?: never
    }

export type PaddingProps = PaddingHorizontal & PaddingVertical

export type PaddingComponent = FC<PaddingProps>
