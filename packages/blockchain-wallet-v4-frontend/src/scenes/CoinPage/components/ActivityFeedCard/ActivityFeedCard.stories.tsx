import React from 'react'
import { IntlProvider } from 'react-intl'
import { IconPlus, PaletteColors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'
import { ClickableArea } from 'components/ClickableArea'
import { Expanded, Flex } from 'components/Flex'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { Padding } from 'components/Padding'

import { AccountSelectBox } from '../AccountSelectBox'
import { Header, TransactionsList } from './components'

export default {
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/CoinPage/ActivityFeedCard'
}

export const SuccessState = () => {
  return (
    <Flex gap={24} flexDirection='column'>
      <Header>
        <Button data-e2e='download' nature='empty-blue'>
          Download
        </Button>

        <AccountSelectBox
          items={[
            {
              text: 'DeFi Wallet',
              value: 'private key'
            }
          ]}
          label='All Accounts'
          onChange={() => {}}
          value=''
        />
      </Header>

      <TransactionsList>
        <ClickableArea onClick={() => {}}>
          <Padding all={16}>
            <Flex alignItems='center' gap={8}>
              <IconCircularBackground color='orange100' size={24}>
                <Flex alignItems='center' justifyContent='center'>
                  <IconPlus color={PaletteColors['orange-400']} size='small' />
                </Flex>
              </IconCircularBackground>

              <Expanded>
                <Flex flexDirection='column'>
                  <Text weight={600} color='grey900' size='16px' lineHeight='24px'>
                    Bought Bitcoin
                  </Text>

                  <Text weight={500} color='grey600' size='14px' lineHeight='20px'>
                    Chase Premier 2102
                  </Text>
                </Flex>
              </Expanded>

              <Expanded>
                <Flex flexDirection='column' alignItems='end'>
                  <Text weight={600} color='grey900' size='16px' lineHeight='24px'>
                    $692.21
                  </Text>

                  <Text weight={500} color='grey600' size='14px' lineHeight='20px'>
                    0.063718391 BTC
                  </Text>
                </Flex>
              </Expanded>
            </Flex>
          </Padding>
        </ClickableArea>

        <ClickableArea onClick={() => {}}>
          <Padding all={16}>
            <Flex alignItems='center' gap={8}>
              <IconCircularBackground color='orange100' size={24}>
                <Flex alignItems='center' justifyContent='center'>
                  <IconPlus color={PaletteColors['orange-400']} size='small' />
                </Flex>
              </IconCircularBackground>

              <Expanded>
                <Flex flexDirection='column'>
                  <Text weight={600} color='grey900' size='16px' lineHeight='24px'>
                    Bought Bitcoin
                  </Text>

                  <Text weight={500} color='grey600' size='14px' lineHeight='20px'>
                    Chase Premier 2102
                  </Text>
                </Flex>
              </Expanded>

              <Expanded>
                <Flex flexDirection='column' alignItems='end'>
                  <Text weight={600} color='grey900' size='16px' lineHeight='24px'>
                    $692.21
                  </Text>

                  <Text weight={500} color='grey600' size='14px' lineHeight='20px'>
                    0.063718391 BTC
                  </Text>
                </Flex>
              </Expanded>
            </Flex>
          </Padding>
        </ClickableArea>
      </TransactionsList>
    </Flex>
  )
}
