import React from 'react'

import { Text } from 'blockchain-info-components'

import OptionRightActionRow from './OptionRightAction'

export default {
  component: OptionRightActionRow,
  title: 'Rows/OptionRightActionRow'
}

export const Default = (args) => (
  <OptionRightActionRow {...args}>
    <>
      <Text weight={600} size='16px' color='grey900'>
        Daily
      </Text>
      <Text weight={500} size='14px' color='grey600'>
        at 9am
      </Text>
    </>
  </OptionRightActionRow>
)
