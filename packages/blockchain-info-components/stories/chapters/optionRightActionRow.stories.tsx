import React from 'react'

import { OptionRightActionRow, Text } from '../../src'

export default {
  title: 'Rows/OptionRightActionRow',
  component: OptionRightActionRow,
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

