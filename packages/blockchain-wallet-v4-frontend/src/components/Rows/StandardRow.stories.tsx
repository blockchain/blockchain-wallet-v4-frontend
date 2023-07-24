import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Icon } from 'blockchain-info-components'
import { IconCircularBackground } from 'components/IconCircularBackground'

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
    <IconCircularBackground color='grey200'>
      <Icon name='key' size='8px' color='grey600' />
    </IconCircularBackground>
  ),
  topLeftText: 'DeFi Wallet',
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
    <IconCircularBackground color='orange400'>
      <Icon name='key' size='8px' color='white' />
    </IconCircularBackground>
  ),
  topLeftText: 'DeFi Wallet',
  topRightText: '$7,926.43'
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true
}

export const RightAction = Template.bind({})
RightAction.args = {
  bottomLeftText: 'Non-custodial',
  icon: (
    <IconCircularBackground color='orange400'>
      <Icon name='key' size='8px' color='white' />
    </IconCircularBackground>
  ),
  rightAction: true,
  topLeftText: 'DeFi Wallet'
}

export const RightActionLoading = Template.bind({})
RightActionLoading.args = {
  loading: true,
  rightAction: true
}
