import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ErrorContent, ErrorContentComponent } from '.'

export default {
  component: ErrorContent,
  title: 'Components/GenericError/ErrorContent'
} as ComponentMeta<ErrorContentComponent>

const Template: ComponentStory<ErrorContentComponent> = (args) => <ErrorContent {...args} />

export const Generic = Template.bind({})
Generic.args = {
  message:
    'Here’s some explainer text that helps the user understand the problem, with a potential link for the user to tap to learn more.',
  title: 'Error Title'
}
