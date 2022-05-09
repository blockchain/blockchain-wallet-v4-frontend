import { FC, ReactElement, ReactNode } from 'react'

export type AboutSectionProps = {
  actions: ReactElement[]
  content: ReactNode
  title: ReactNode
}

export type AboutSectionComponent = FC<AboutSectionProps>
