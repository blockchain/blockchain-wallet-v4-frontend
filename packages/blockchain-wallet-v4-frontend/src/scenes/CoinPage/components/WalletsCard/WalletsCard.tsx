import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'
import { SeparatedList } from 'components/SeparatedList'

import { WalletsCardComponent } from './types'

const WalletsCard: WalletsCardComponent = ({ children }) => {
  return (
    <Card borderWidth={1} borderRadius='md'>
      <Padding top={16}>
        <Flex flexDirection='column' gap={0}>
          <Padding horizontal={16} vertical={0}>
            <Text color='grey600' size='14px' weight={500} lineHeight='20px'>
              <FormattedMessage id='copy.wallets_accounts' defaultMessage='Wallets & Accounts' />
            </Text>
          </Padding>
          <SeparatedList>{children}</SeparatedList>
        </Flex>
      </Padding>
    </Card>
  )
}

export { WalletsCard }
