import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { SeparatedList } from './SeparatedList'
import { SeparatedListComponent } from './types'

const separatedListStoriesMeta: ComponentMeta<SeparatedListComponent> = {
  component: SeparatedList,
  title: 'Comnponents/SeparatedList'
}

const Template: ComponentStory<SeparatedListComponent> = (args) => <SeparatedList {...args} />

export const Default = Template.bind({})
Default.args = {
  children: [<span key={0}>item 1</span>, <span key={1}>item 2</span>, <span key={2}>item 3</span>]
}

export default separatedListStoriesMeta
