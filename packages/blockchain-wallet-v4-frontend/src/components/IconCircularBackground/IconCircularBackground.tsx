import React from 'react'
import { PaletteColors } from '@blockchain-com/constellation'

import { CircularBackground, Container, ContentContainer } from './IconCircularBackground.styles'
import { IconCircularBackgroundComponent } from './IconCircularBackground.types'

export const IconCircularBackground: IconCircularBackgroundComponent = ({
  backgroundOpacity = 1,
  children,
  color = 'default',
  size = 'default'
}) => {
  return (
    <Container size={size}>
      <CircularBackground
        color={PaletteColors[color] ?? color}
        size={size}
        backgroundOpacity={backgroundOpacity}
      />
      <ContentContainer size={size}>{children}</ContentContainer>
    </Container>
  )
}
