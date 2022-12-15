import React from 'react'
import { Flex, SemanticColors, Text } from '@blockchain-com/constellation'

import { Image } from 'blockchain-info-components'

import Details from '../Details'
import { ScenarioType } from '../HowItWorks.types'
import { ImageContainer, scenarios } from './Scenarios.model'

const Scenarios = () => (
  <>
    {scenarios.map(({ description, details, id, image, title }: ScenarioType) => (
      <Flex flexDirection='column' gap={24} key={id}>
        <Flex flexDirection='column' gap={4}>
          <Text color={SemanticColors.title} variant='body2'>
            {title}
          </Text>
          <Text color={SemanticColors.body} variant='paragraph1'>
            {description}
          </Text>
        </Flex>
        <ImageContainer>
          <Image name={image} />
          <Details details={details} id={id} />
        </ImageContainer>
      </Flex>
    ))}
  </>
)

export default Scenarios
