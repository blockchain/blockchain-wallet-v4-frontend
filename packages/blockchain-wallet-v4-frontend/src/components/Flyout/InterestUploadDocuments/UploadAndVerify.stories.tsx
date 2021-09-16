import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import UploadAndVerify from './UploadAndVerify'

export default {
  argTypes: {},
  args: {
    documentLimits: {
      categories: ['PROOF_OF_ADDRESS', 'PROOF_OF_INCOME', 'OTHER'],
      maxAllowedFileSizeMBs: 5,
      maxNumAllowedFiles: 8,
      validTypes: ['jpg', 'png', 'heic']
    },
    nextStep: () => {},
    previousStep: () => {},
    submitData: (files) => {}
  },
  component: UploadAndVerify,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/InterestUploadDocuments/UploadAndVerify'
} as ComponentMeta<typeof UploadAndVerify>

const Template: ComponentStory<typeof UploadAndVerify> = (args) => <UploadAndVerify {...args} />

export const Default = Template.bind({})
