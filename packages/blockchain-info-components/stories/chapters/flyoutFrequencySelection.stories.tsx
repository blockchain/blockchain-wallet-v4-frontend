import React from 'react'

import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutHeader,
  Text,
  OptionRightActionRow
} from '../../src'

export default {
  title: 'Flyouts/FrequencySelection',
}

export const Default = (args) => (
  <FlyoutContainer>
    <FlyoutHeader data-e2e='fooooooo' mode='back' onClick={close}>
      Buy $100 of BTC
    </FlyoutHeader>
    <FlyoutContent mode='top'>
      <OptionRightActionRow onClick={() => {}}>
        <Text weight={600} size='16px' color='grey900'>
          Daily
        </Text>
      </OptionRightActionRow>
      <OptionRightActionRow onClick={() => {}}>
        <>
          <Text weight={600} size='16px' color='grey900'>
            Weekly
          </Text>
          <Text weight={500} size='14px' color='grey600'>
            On Mondays
          </Text>
        </>
      </OptionRightActionRow>
      <OptionRightActionRow onClick={() => {}}>
        <>
          <Text weight={600} size='16px' color='grey900'>
            Monthly
          </Text>
          <Text weight={500} size='14px' color='grey600'>
            On the 14th
          </Text>
        </>
      </OptionRightActionRow>
      <OptionRightActionRow onClick={() => {}}>
        <>
          <Text weight={600} size='16px' color='grey900'>
            Twice a Month
          </Text>
          <Text weight={500} size='14px' color='grey600'>
            On the 14th and 28th
          </Text>
        </>
      </OptionRightActionRow>
    </FlyoutContent>
  </FlyoutContainer>
)