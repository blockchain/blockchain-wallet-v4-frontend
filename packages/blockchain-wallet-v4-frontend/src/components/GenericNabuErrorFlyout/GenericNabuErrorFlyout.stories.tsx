import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { NabuError } from 'services/errors'

import GenericNabuErrorFlyout from './GenericNabuErrorFlyout'
import { GenericNabuErrorFlyoutComponent } from './GenericNabuErrorFlyout.types'

export default {
  component: GenericNabuErrorFlyout,
  parameters: {
    layout: 'fullscreen'
  },
  title: 'Components/GenericNabuErrorFlyout'
} as ComponentMeta<GenericNabuErrorFlyoutComponent>

const Template: ComponentStory<GenericNabuErrorFlyoutComponent> = (args) => (
  <div style={{ height: '100vh' }}>
    <GenericNabuErrorFlyout {...args} />
  </div>
)

const genericNabuError = new NabuError({
  icon: {
    accessibility: {
      description: ''
    },
    status: {
      url: ''
    },
    url: ''
  },
  message:
    'Here’s some explainer text that helps the user understand the problem, with a potential link for the user to tap to learn more.',
  title: 'Error Title'
})

const paymentFailureError = new NabuError({
  actions: [
    {
      title: 'Different payment',
      url: 'https://blockchain.com/1/1'
    },
    {
      title: 'Close'
    }
  ],
  message:
    'There was an issue with your bank. Please try again or use a different payment method. If this keeps happening, please contact support.',
  title: 'Payment Failed'
})

export const Default = Template.bind({})
Default.args = {
  error: genericNabuError
}

export const PaymentFailureError = Template.bind({})
PaymentFailureError.args = {
  error: paymentFailureError
}
