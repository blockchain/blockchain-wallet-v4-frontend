import { FC, ReactNode } from 'react'

export type SeparatedListProps = {
  separator?: ReactNode
}

export type SeparatedListComponent = FC<SeparatedListProps>
