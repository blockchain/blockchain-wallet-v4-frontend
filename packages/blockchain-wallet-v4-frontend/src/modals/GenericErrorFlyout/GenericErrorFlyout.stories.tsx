import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { GenericErrorFlyout, GenericErrorFlyoutComponent } from '.'
import { ActionsList, CoinWarningLogo, ErrorContent } from './components'

export default {
  component: GenericErrorFlyout,
  title: 'Flyouts/GenericErrorFlyout'
} as ComponentMeta<GenericErrorFlyoutComponent>

const Template: ComponentStory<GenericErrorFlyoutComponent> = (args) => (
  <GenericErrorFlyout {...args} />
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
      <CoinWarningLogo coin='BTC' />
      <ErrorContent
        title='Error Title'
        message='Here’s some explainer text that helps the user understand the problem, with a potential link for the user to tap to learn more.'
      />
    </>
  )
}
