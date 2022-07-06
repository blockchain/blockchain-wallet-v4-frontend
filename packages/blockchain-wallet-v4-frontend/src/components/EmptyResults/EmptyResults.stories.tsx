import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import EmptyResults from '.'

export default {
  component: EmptyResults,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <Story />
      </IntlProvider>
    )
  ],
  title: 'Components/EmptyResults'
} as ComponentMeta<typeof EmptyResults>

const Template: ComponentStory<typeof EmptyResults> = (args) => <EmptyResults {...args} />

export const Default = Template.bind({})
Default.args = {}
