import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button, Icon } from 'blockchain-info-components'

import { ActionsList, ErrorContent, GenericErrorLayout, GenericErrorLayoutComponent } from '..'
import { ErrorIconWithSeverity } from '../ErrorIconWithSeverity'

export default {
  component: GenericErrorLayout,
  title: 'Components/GenericError/GenericErrorLayout'
} as ComponentMeta<GenericErrorLayoutComponent>

const Template: ComponentStory<GenericErrorLayoutComponent> = (args) => (
  <GenericErrorLayout {...args} />
)

export const Default = Template.bind({})
Default.args = {
  actions: (
    <ActionsList>
      <Button data-e2e='hello' nature='primary' fullwidth>
        Primary
      </Button>
      <Button data-e2e='hello' nature='empty-blue'>
        Minimal
      </Button>
    </ActionsList>
  ),
  children: (
    <>
      <ErrorIconWithSeverity
        iconStatusUrl=''
        iconUrl=''
        iconFallback={<Icon size='72px' name='BTC' />}
      />

      <ErrorContent
        title='Error Title'
        message='Here’s some explainer text that helps the user understand the problem, with a potential link for the user to tap to learn more.'
      />
    </>
  )
}
