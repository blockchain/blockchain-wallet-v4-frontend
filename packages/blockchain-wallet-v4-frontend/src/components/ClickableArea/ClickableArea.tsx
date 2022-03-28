import React from 'react'

import { Container } from './styles'
import { ClickableAreaComponent } from './types'

export const ClickableArea: ClickableAreaComponent = ({ children, onClick }) => {
  return (
    <Container showBackgroundOnHover={!!onClick} onClick={onClick}>
      {children}
    </Container>
  )
}
