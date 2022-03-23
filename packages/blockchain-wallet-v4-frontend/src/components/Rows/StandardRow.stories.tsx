import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Icon } from 'blockchain-info-components'

import StandardRow from './StandardRow'

export default {
  component: StandardRow,
  title: 'Rows/StandardRow'
} as ComponentMeta<typeof StandardRow>

const Template: ComponentStory<typeof StandardRow> = (args) => <StandardRow {...args} />

export const Default = Template.bind({})
Default.args = {
  bottomLeftText: 'Non-custodial',
  bottomRightText: '0.00039387 BTC',
  icon: (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#C4C4C4',
        borderRadius: '50%',
        display: 'flex',
        height: '24px',
        justifyContent: 'center',
        width: '24px'
      }}
    >
      <Icon name='key' size='8px' color='grey600' />
    </div>
  ),
  topLeftText: 'Private Key Wallet',
  topRightText: '$7,926.43'
}

const MultipleRowsTemplate: ComponentStory<typeof StandardRow> = (args) => (
  <div>
    <StandardRow {...args} />
    <StandardRow {...args} />
    <StandardRow {...args} />
    <StandardRow {...args} />
  </div>
)

export const MultipleRows = MultipleRowsTemplate.bind({})
MultipleRows.args = {
  bottomLeftText: 'Non-custodial',
  bottomRightText: '0.00039387 BTC',
  icon: (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#C4C4C4',
        borderRadius: '50%',
        display: 'flex',
        height: '24px',
        justifyContent: 'center',
        width: '24px'
      }}
    >
      <Icon name='key' size='8px' color='grey600' />
    </div>
  ),
  topLeftText: 'Private Key Wallet',
  topRightText: '$7,926.43'
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true
}
