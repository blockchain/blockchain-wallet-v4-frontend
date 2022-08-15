import { FC } from 'react'
import { CSSProperties } from 'styled-components'

type CircularProgressProps = {
  fill?: string
  style?: CSSProperties
  value: number
}

type CircularProgressComponent = FC<CircularProgressProps>

export { CircularProgressComponent, CircularProgressProps }
