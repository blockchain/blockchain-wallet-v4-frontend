import { FC, ReactNode } from 'react'

type ErrorContentProps = {
  children?: never
  message?: ReactNode
  title: ReactNode
}

type ErrorContentComponent = FC<ErrorContentProps>

export type { ErrorContentComponent, ErrorContentProps }
