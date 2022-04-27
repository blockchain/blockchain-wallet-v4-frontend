import React from 'react'

import { Flex } from 'components/Flex'

import { ActionsListComponent } from './ActionsList.types'

const ActionsList: ActionsListComponent = ({ children }) => (
  <Flex gap={16} flexDirection='column'>
    {children}
  </Flex>
)

export default ActionsList
