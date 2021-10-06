import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import Oops from './Oops'

export default {
  component: Oops,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh' }}>
          <div style={{ border: '1px solid #ddd', width: '480px' }}>{Story()}</div>
        </div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/Errors/Oops'
} as ComponentMeta<typeof Oops>

const Template: ComponentStory<typeof Oops> = (args) => <Oops {...args} />

export const Default = Template.bind({})
Default.args = {
  'data-e2e': 'foooo',
  handler: () => {}
}
