import React from 'react'

import { Flex } from 'components/Flex'

import { TabsComponent } from './types'

export const Tabs: TabsComponent = ({ children, direction = 'horizontal', gap = 20 }) => {
  return (
    <Flex flexDirection={direction === 'vertical' ? 'column' : 'row'} gap={gap}>
      {children}
    </Flex>
  )
}
