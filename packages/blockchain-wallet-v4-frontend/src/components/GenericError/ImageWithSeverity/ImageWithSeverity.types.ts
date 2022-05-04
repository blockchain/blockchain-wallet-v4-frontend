import { FC, ReactNode } from 'react'

type ImageWithSeverityProps = {
  children: ReactNode
  severity?: 'warning'
}

type ImageWithSeverityComponent = FC<ImageWithSeverityProps>

export type { ImageWithSeverityComponent, ImageWithSeverityProps }
