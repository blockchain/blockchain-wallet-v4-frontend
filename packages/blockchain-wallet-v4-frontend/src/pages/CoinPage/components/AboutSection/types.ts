import { FC, ReactElement } from 'react'

export type AboutSectionProps = {
  actions: ReactElement[]
  content: string
  title: string
}

export type AboutSectionComponent = FC<AboutSectionProps>
