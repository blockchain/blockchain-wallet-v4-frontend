import React from 'react'
import { Padding, PaletteColors, SemanticColors, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'

const Description = styled(Text)`
  max-width: 400px;
  padding-bottom: 1rem;
  color: ${PaletteColors['grey-700']};
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`

type SlideData = {
  description: React.ReactElement
  image: React.ComponentProps<typeof Image>['name']
  imageWidth?: string
  title: React.ReactElement
}

export const InfoWidget = ({ description, image, imageWidth = '100%', title }: SlideData) => {
  return (
    <Container>
      <Image name={image} width={imageWidth} />
      <Padding top={2} bottom={1}>
        <Text variant='title3' textAlign='center' color={SemanticColors.title}>
          {title}
        </Text>
      </Padding>
      <Description variant='body1' textAlign='center' color={PaletteColors['grey-700']}>
        {description}
      </Description>
    </Container>
  )
}
