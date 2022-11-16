import React from 'react'
import { Flex, SemanticColors, Text } from '@blockchain-com/constellation'

import { Image } from 'blockchain-info-components'

type SlideData = {
  description: React.ReactElement
  image: 'dex-onboarding-slide-welcome' | 'dex-onboarding-slide-swap' | 'dex-onboarding-slide-funds'
  title: React.ReactElement
}

export const Slide = ({ description, image, title }: SlideData) => {
  return (
    <Flex flexDirection='column' alignItems='center'>
      <Image name={image} width='100%' />
      <Text variant='title2' textAlign='center' color={SemanticColors.title}>
        {title}
      </Text>
      <Text variant='subheading' textAlign='center' color={SemanticColors.muted}>
        {description}
      </Text>
    </Flex>
  )
}
