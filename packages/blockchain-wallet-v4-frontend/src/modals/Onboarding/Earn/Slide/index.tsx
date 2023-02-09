import React from 'react'
import { Flex, SemanticColors, Text } from '@blockchain-com/constellation'

import { Image } from 'blockchain-info-components'

import { SlidePropsType } from '../Earn.types'
import { DescriptionContainer } from './Slide.styles'

export const Slide = ({ description, image, title }: SlidePropsType) => (
  <Flex alignItems='center' flexDirection='column' gap={24}>
    <Image name={image} />
    <Flex alignItems='center' flexDirection='column'>
      <Text variant='title2' textAlign='center' color={SemanticColors.title}>
        {title}
      </Text>
      <DescriptionContainer>
        <Flex justifyContent='center'>
          <Text color={SemanticColors.body} textAlign='center' variant='body1'>
            {description}
          </Text>
        </Flex>
      </DescriptionContainer>
    </Flex>
  </Flex>
)

export default Slide
