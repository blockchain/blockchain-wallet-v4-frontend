import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import FabButton from '.'

export default {
  argTypes: {},
  component: FabButton,
  decorators: [
    (Story) => {
      return (
        <IntlProvider locale='en'>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              height: '200px',
              justifyContent: 'center'
            }}
          >
            {Story()}
          </div>
        </IntlProvider>
      )
    }
  ],
  title: 'FabButton'
} as ComponentMeta<typeof FabButton>

const Template: ComponentStory<typeof FabButton> = (args) => <FabButton {...args} />

export const Default = Template.bind({})
Default.args = {
  onClick: () => {}
}
