import { FC, ReactNode } from 'react'

type ExternalSVGProps = {
  fallback?: ReactNode
  height: number
  src: string
  width: number
}

type ExternalSVGComponent = FC<ExternalSVGProps>

export type { ExternalSVGComponent, ExternalSVGProps }
