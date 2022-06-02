import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { NabuError } from 'services/errors'

import GenericNabuError from './GenericNabuError'
import { GenericNabuErrorComponent } from './GenericNabuError.types'

const genericNabuError = new NabuError({
  message:
    'Here’s some explainer text that helps the user understand the problem, with a potential link for the user to tap to learn more.',
  title: 'Error Title'
})

const paymentFailureError = new NabuError({
  message:
    'There was an issue with your bank. Please try again or use a different payment method. If this keeps happening, please contact support.',
  title: 'Payment Failed'
})

export default {
  argTypes: {
    error: {
      mapping: {
        'Payment failure': paymentFailureError,
        generic: genericNabuError
      },
      options: ['generic', 'Payment failure']
    }
  },
  component: GenericNabuError,
  title: 'Components/GenericNabuError'
} as ComponentMeta<GenericNabuErrorComponent>

const Template: ComponentStory<GenericNabuErrorComponent> = (args) => <GenericNabuError {...args} />

export const Generic = Template.bind({})
Generic.args = {
  error: genericNabuError
}

export const PaymnetFailure = Template.bind({})
PaymnetFailure.args = {
  error: paymentFailureError
}
