import React from 'react'
import { Flex, Padding, PaletteColors, SemanticColors, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'

const Description = styled(Text)`
  max-width: 327px;
  padding-bottom: 1rem;
  color: ${PaletteColors['grey-700']};
`

type SlideData = {
  description: React.ReactElement
  image: 'dex-onboarding-slide-welcome' | 'dex-onboarding-slide-swap' | 'dex-onboarding-slide-funds'
  title: React.ReactElement
}

export const Content = ({ description, image, title }: SlideData) => {
  return (
    <Flex flexDirection='column' alignItems='center'>
      <Image name={image} width='100%' />
      <Padding top={2} bottom={1}>
        <Text variant='title2' textAlign='center' color={SemanticColors.title}>
          {title}
        </Text>
      </Padding>
      <Description variant='body1' textAlign='center' color={PaletteColors['grey-700']}>
        {description}
      </Description>
    </Flex>
  )
}
