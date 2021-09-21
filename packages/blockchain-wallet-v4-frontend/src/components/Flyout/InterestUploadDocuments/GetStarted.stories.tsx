import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import GetStarted from './GetStarted'

export default {
  argTypes: {},
  args: {
    nextStep: () => {},
    previousStep: () => {}
  },
  component: GetStarted,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/InterestUploadDocuments/GetStarted'
} as ComponentMeta<typeof GetStarted>

const Template: ComponentStory<typeof GetStarted> = (args) => <GetStarted {...args} />

export const Default = Template.bind({})
