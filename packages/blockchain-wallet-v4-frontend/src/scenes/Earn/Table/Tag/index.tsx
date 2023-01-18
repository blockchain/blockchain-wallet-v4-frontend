import React from 'react'
import { Flex, Padding } from '@blockchain-com/constellation'

import { TagContainer } from './Tag.styles'
import { TagPropsType } from './Tag.types'

const Tag = ({ backgroundColor, borderColor, children }: TagPropsType) => (
  <TagContainer backgroundColor={backgroundColor} borderColor={borderColor}>
    <Flex>
      <Padding vertical={0.25} horizontal={0.5}>
        {children}
      </Padding>
    </Flex>
  </TagContainer>
)

export default Tag
