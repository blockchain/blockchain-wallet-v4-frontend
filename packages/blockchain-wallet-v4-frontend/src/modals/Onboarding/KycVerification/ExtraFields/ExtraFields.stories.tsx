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
          text: 'Buy cryptocurrencies with cards or bank transfer',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q1-a2',
          text: 'Swap my cryptocurrencies',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q1-a3',
          text: 'Send Cryptocurrencies to family or friends',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q1-a4',
          text: 'Online Purchases',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q1-a5',
          text: 'Business',
          type: 'SELECTION'
        }
      ],
      id: 'q1',
      instructions: '(Select all that apply)',
      text: 'Nature \u0026 Purpose of Business Relationship',
      type: 'MULTIPLE_SELECTION'
    },
    {
      children: [
        {
          checked: false,
          id: 'q2-a1',
          text: 'Salary',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q2-a2',
          text: 'Crypto Trading',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q2-a3',
          text: 'Crypto Mining',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q2-a4',
          text: 'Investment Income',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q2-a5',
          text: 'Real Estate',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q2-a6',
          text: 'Inheritance',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q2-a7',
          text: 'Family',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [
            {
              hint: 'Enter source of funds here',
              id: 'q2-a8-a1',
              input: '',
              text: '',
              type: 'OPEN_ENDED'
            }
          ],
          id: 'q2-a8',
          text: 'Other',
          type: 'SELECTION'
        }
      ],
      id: 'q2',
      instructions: '(Select only one)',
      isDropdown: true,
      text: 'Source of funds',
      type: 'SINGLE_SELECTION'
    },
    {
      children: [
        {
          checked: false,
          id: 'q3-a1',
          text: 'Yes',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q3-a2',
          text: 'No',
          type: 'SELECTION'
        }
      ],
      id: 'q3',
      instructions: '(Select only one)',
      isDropdown: true,
      text: 'Are you acting on your own behalf?',
      type: 'SINGLE_SELECTION'
    },
    {
      children: [
        {
          checked: false,
          id: 'q4-a1',
          text: 'No',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'q4-a2',
          text: 'Yes, I am',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [
            {
              hint: 'John Smith',
              id: 'q4-a3-a1',
              input: '',
              text: 'Name, Last Name',
              type: 'OPEN_ENDED'
            },
            {
              hint: 'Family Member',
              id: 'q4-a3-a2',
              input: '',
              text: 'Their Relation To You',
              type: 'OPEN_ENDED'
            }
          ],
          id: 'q4-a3',
          text: 'Yes, My Family Member Or Close Associate Is',
          type: 'SELECTION'
        }
      ],
      id: 'q4',
      instructions: '(Select only one)',
      text: 'Are you a Politically Exposed Person (PEP)',
      type: 'SINGLE_SELECTION'
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
