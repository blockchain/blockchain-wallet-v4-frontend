import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import ExtraFields from './template.success'

const EXTRA_STEPS_RESPONSE = {
  nodes: [
    {
      children: [
        {
          checked: false,
          id: 'q1-a1',
          text: 'Buy cryptocurrency with cards or bank transfer',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q1-a2',
          text: 'Swap my cryptocurrencies',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q1-a3',
          text: 'Send Cryptocurrencies to family or friends',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q1-a4',
          text: 'Online Purchases',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q1-a5',
          text: 'Business',
          type: 'selection'
        }
      ],
      id: 'q1',
      text: 'Nature & Purpose of Business Relationship',
      type: 'multiple-selection'
    },
    {
      children: [
        {
          checked: false,
          id: 'q2-a1',
          text: 'Salary',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q2-a2',
          text: 'Crypto Trading',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q2-a3',
          text: 'Crypto Mining',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q2-a4',
          text: 'Investment Income',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q2-a5',
          text: 'Real Estate',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q2-a6',
          text: 'Inheritance',
          type: 'selection'
        },
        {
          checked: false,
          children: [
            {
              hint: 'Enter source of funds here',
              id: 'q2-a7-a1',
              input: '',
              text: '',
              type: 'open-ended'
            }
          ],
          id: 'q2-a7',
          text: 'Other',
          type: 'selection'
        }
      ],
      id: 'q2',
      isDropdown: true,
      text: 'Source of funds',
      type: 'single-selection'
    },
    {
      children: [
        {
          checked: false,
          id: 'q3-a1',
          text: 'Yes',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q3-a2',
          text: 'No',
          type: 'selection'
        }
      ],
      id: 'q3',
      isDropdown: true,
      text: 'Are you acting on your own behalf?',
      type: 'single-selection'
    },
    {
      children: [
        {
          checked: false,
          id: 'q4-a1',
          text: 'No',
          type: 'selection'
        },
        {
          checked: false,
          id: 'q4-a2',
          text: 'Yes, I am',
          type: 'selection'
        },
        {
          checked: false,
          children: [
            {
              hint: 'John Smith',
              id: 'q4-a3-a1',
              input: '',
              text: 'Name, Last Name',
              type: 'open-ended'
            },
            {
              hint: 'Family Member',
              id: 'q4-a3-a2',
              input: '',
              text: 'Their Relation To You',
              type: 'open-ended'
            }
          ],
          id: 'q4-a3',
          text: 'Yes, My Family Member Or Close Associate Is',
          type: 'selection'
        }
      ],
      id: 'q4',
      text: 'Are you a Politically Exposed Person (PEP)',
      type: 'single-selection'
    }
  ]
}

const store = createStore(combineReducers({}))

export default {
  argTypes: {},
  args: {
    error: null,
    extraSteps: EXTRA_STEPS_RESPONSE,
    formErrors: {},
    invalid: false,
    onSubmit: () => {},
    submitting: false
  },
  component: ExtraFields,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
        </IntlProvider>
      </Provider>
    )
  ],
  title: 'Pages/KYC/ExtraFields'
} as ComponentMeta<typeof ExtraFields>

const Template: ComponentStory<typeof ExtraFields> = (args) => <ExtraFields {...args} />

export const Default = Template.bind({})
