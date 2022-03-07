import { FC } from 'react'

export type AlertCardProps = {
  content: string
  title: string
}

export type AlertCardComponent = FC<AlertCardProps>
