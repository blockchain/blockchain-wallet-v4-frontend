import React from 'react'
import { ComponentMeta } from '@storybook/react'

import { Flex, FlexComponent } from '.'

const flexStory: ComponentMeta<FlexComponent> = {
  component: Flex,
  title: 'Structural/Flex'
}

const GreyCircle = () => (
  <div style={{ background: 'grey', borderRadius: 12, height: 24, width: 24 }} />
)

export const IconListItemExample = () => {
  return (
    <Flex gap={6}>
      <Flex alignItems='center' justifyContent='center'>
        <GreyCircle />
      </Flex>

      <Flex gap={6} flexDirection='column'>
        <span style={{ background: 'grey' }}>Title</span>

        <span style={{ background: 'grey' }}>Subtitle</span>
      </Flex>
    </Flex>
  )
}

export const AppBarExample = () => {
  return (
    <Flex justifyContent='space-between'>
      <Flex gap={6} alignItems='center'>
        <GreyCircle />

        <span>Title</span>
      </Flex>

      <Flex gap={4}>
        <GreyCircle />
        <GreyCircle />
        <GreyCircle />
        <GreyCircle />
      </Flex>
    </Flex>
  )
}

export default flexStory
