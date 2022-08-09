import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { NabuError } from 'services/errors'

import { GenericNabuErrorCard, GenericNabuErrorCardComponent } from '.'

export default {
  component: GenericNabuErrorCard,
  title: 'Components/GenericNabuErrorCard'
} as ComponentMeta<GenericNabuErrorCardComponent>

const Template: ComponentStory<GenericNabuErrorCardComponent> = (args) => (
  <GenericNabuErrorCard {...args} />
)

export const Warning = Template.bind({})
Warning.args = {
  error: new NabuError({
    actions: [
      {
        title: 'Select a Payment Method'
      },
      {
        title: 'Learn more'
      }
    ],
    message: 'This **** card doesn’t allow crypto transactions. Try a debit card instead.',
    title: 'Buying crypto not supported'
  }),
  variant: 'warning'
}

export const Error = Template.bind({})
Error.args = {
  error: new NabuError({
    actions: [
      {
        title: 'Select a Payment Method'
      },
      {
        title: 'Learn more'
      }
    ],
    message: 'This **** card doesn’t allow crypto transactions. Try a debit card instead.',
    title: 'Buying crypto not supported'
  }),
  variant: 'error'
}
