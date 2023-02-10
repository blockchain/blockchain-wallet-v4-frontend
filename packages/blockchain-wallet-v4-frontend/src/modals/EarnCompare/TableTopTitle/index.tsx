import React from 'react'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { TableTopTitlePropsType } from './TableTopTitle.types'

const TableTopTitle = ({ description, icon, title }: TableTopTitlePropsType) => (
  <Flex alignItems='center' flexDirection='column' justifyContent='center' width='fill'>
    <Padding bottom={0.5}>{icon}</Padding>
    <Padding bottom={0.5}>
      <Text color={SemanticColors.title} variant='title3'>
        {title}
      </Text>
    </Padding>
    <Padding>
      <Text color={SemanticColors.title} variant='caption1'>
        {description}
      </Text>
    </Padding>
  </Flex>
)

export default TableTopTitle
