import { ReactNode } from 'react'

export type LabelType = {
  id: string
  label: ReactNode
}

export type DetailType = {
  subText?: string
  text?: string
  title: ReactNode
}
export type DetailsType = DetailType[]

export type ScenarioType = {
  description: ReactNode
  details: DetailsType[]
  id: string
  image: 'scenario-1-graph' | 'scenario-2-graph'
  title: ReactNode
}

export type DetailsPropsType = {
  details: DetailsType[]
  id: string
}
