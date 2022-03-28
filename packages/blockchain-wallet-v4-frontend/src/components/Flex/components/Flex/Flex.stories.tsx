import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Flex, FlexComponent } from '.'

const flexStory: ComponentMeta<FlexComponent> = {
  component: Flex,
  title: 'Components/Flex'
}

const Template: ComponentStory<FlexComponent> = (args) => <Flex {...args} />

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
