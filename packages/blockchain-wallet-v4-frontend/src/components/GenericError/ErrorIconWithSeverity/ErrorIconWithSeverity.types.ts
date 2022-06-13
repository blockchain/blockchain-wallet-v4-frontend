import { FC, ReactNode } from 'react'

type ErrorIconWithSeverityProps = {
  iconFallback?: ReactNode
  iconStatusUrl: string
  iconUrl: string
  statusFallback?: ReactNode
}

type ErrorIconWithSeverityComponent = FC<ErrorIconWithSeverityProps>

export type { ErrorIconWithSeverityComponent, ErrorIconWithSeverityProps }
