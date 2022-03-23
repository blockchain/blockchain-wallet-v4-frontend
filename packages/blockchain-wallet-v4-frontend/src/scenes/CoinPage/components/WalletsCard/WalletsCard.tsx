import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { PaddingSymetric } from 'components/Padding'

import { WalletsCardComponent } from './types'

const WalletsCard: WalletsCardComponent = ({ children }) => {
  return (
    <Card>
      <PaddingSymetric horizontal={0} vertical={16}>
        <Flex flexDirection='column' gap={0}>
          <PaddingSymetric horizontal={16} vertical={0}>
            <Text color='grey600' size='14px' weight={500} lineHeight='20px'>
              <FormattedMessage id='copy.wallets_accounts' defaultMessage='Wallets & Accounts' />
            </Text>
          </PaddingSymetric>
          <div>{children}</div>
        </Flex>
      </PaddingSymetric>
    </Card>
  )
}

export { WalletsCard }
