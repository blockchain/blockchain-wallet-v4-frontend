import React from 'react'

import { Flex } from 'components/Flex'

import { GenericErrorLayoutComponent } from './GenericErrorLayout.types'

const GenericErrorLayout: GenericErrorLayoutComponent = ({ actions, children }) => (
  <Flex flexDirection='column' gap={40}>
    <Flex gap={24} flexDirection='column' alignItems='stretch' justifyContent='center'>
      {children}
    </Flex>

    {actions}
  </Flex>
)

export default GenericErrorLayout
