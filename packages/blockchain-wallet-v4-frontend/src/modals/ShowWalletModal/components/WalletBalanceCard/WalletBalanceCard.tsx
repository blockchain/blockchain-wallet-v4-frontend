import React from 'react'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { WalletBalanceCardComponent } from './WalletBalanceCard.types'

export const WalletBalanceCard: WalletBalanceCardComponent = ({ subtitle, title }) => {
  return (
    <Padding horizontal={40} bottom={40}>
      <Flex flexDirection='column' gap={8}>
        <Text weight={600} color='grey900' size='24px' lineHeight='32px'>
          {title}
        </Text>

        <Text weight={600} color='grey600' size='20px' lineHeight='30px'>
          {subtitle}
        </Text>
      </Flex>
    </Padding>
  )
}
