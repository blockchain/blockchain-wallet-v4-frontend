import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import Uploaded from './Uploaded'

export default {
  argTypes: {},
  args: {
    close: () => {}
  },
  component: Uploaded,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/InterestUploadDocuments/Uploaded'
} as ComponentMeta<typeof Uploaded>

const Template: ComponentStory<typeof Uploaded> = (args) => <Uploaded {...args} />

export const Default = Template.bind({})
