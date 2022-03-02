import React from 'react'

import { Container } from './styles'
import { CardComponent } from './types'

export const Card: CardComponent = ({ children }) => {
  return <Container>{children}</Container>
}
