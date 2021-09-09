import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import UploadAndVerify from './UploadAndVerify'

export default {
  argTypes: {},
  args: {
    nextStep: () => {},
    previousStep: () => {},
    submitData: (files) => {
      // eslint-disable-next-line
      console.log(files)
    }
  },
  component: UploadAndVerify,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh', width: '480px' }}>
          <Story />
        </div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/InterestUploadDocuments/UploadAndVerify'
} as ComponentMeta<typeof UploadAndVerify>

export const Template: ComponentStory<typeof UploadAndVerify> = (args) => (
  <UploadAndVerify {...args} />
)

export const Default = Template.bind({})
